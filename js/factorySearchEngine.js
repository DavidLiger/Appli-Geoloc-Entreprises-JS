//Made by David Liger

var mymap;
var latBU;
var longBU;
var route;
var regionMarkers = [];
var BUsMarkers = [];
var factoryMarkers = [];
var centreFRLat = 46.883331;
var centreFRLong = 1.85;
var selecArray = [];
var tooMuchArray = [];
var popUpBU = " ";
var uniqueBU = " ";
var resultsNumber;
var arrayLatLong = [];
//var pour les boutons
var btnNivMapRegID;
var btnNivMapRegNom;
var btnNivMapBUNom;
var btnFR = "";
var btnREG = "";
var btnBU = "";
var btnMultiBU = "";
//gestion droits utilisateur
var nivUser = "";
var arrayBUs = [];

$(document).ready(function () {
	clearInput();
	// création de la map
	document
		.getElementById('mapid')
		.innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
	var mapboxUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
	var mapboxToken = 'pk.eyJ1IjoiZGF2aWRsaWdlciIsImEiOiJjazI2NHk5OG8xbTZjM25ucndrb2d1dWxhIn0.AD3IDVAe3' +
		'rgvwgJ59VKptA';

	//calque streets de la map
	var tileStreets = L.tileLayer(mapboxUrl, {
		maxZoom: 18,
		id: 'mapbox/streets-v11',
		accessToken: mapboxToken
	});

	//calque satellite de la map
	var tileSatellite = L.tileLayer(mapboxUrl, {
		maxZoom: 18,
		id: 'mapbox/satellite-v9',
		accessToken: mapboxToken
	});

	//map qui reçoit les tuiles
	mymap = L.map('map', {
		center: [
			centreFRLat, centreFRLong
		],
		zoom: 6,
		layers: [
			tileStreets, tileSatellite
		],
		trackResize: true
	});

	//objet contenant les couches
	var baseMaps = {
		"Satellite": tileSatellite,
		"Rues": tileStreets
	};

	//objet qui permet de controler les couches
	L
		.control
		.layers(baseMaps)
		.addTo(mymap);
	tileStreets.addTo(mymap);

	userRightsManager();

	// démarrage sur le centre de la france initMapFrance(); clic sur entreprise
	// dans la liste
	$('#entTabContainer').on('click', "#entreprises, #entrepriseID", function () {
		// recherche des coordonnées en passant par Ajax
		infosEnts(this);
		// QUAND CLIC remplace la liste par bouton, ce bouton redéplie la liste
		document
			.getElementById('entTabContainer')
			.style
			.display = 'none';
		document
			.getElementById('mapControls')
			.style
			.display = 'block';
		document
			.getElementById('navNiveauMap')
			.style
			.display = 'flex';
		document
			.getElementById('btnsGenerals')
			.style
			.display = 'flex';
		if (btnNivMapRegNom != null && btnNivMapBUNom != null) {
			btnsDisplayNiveauMap("F", btnNivMapRegID, btnNivMapRegNom, btnNivMapBUNom, latBU, longBU);
		}
	});

	//btnTooMuchRes
	$('#entTabContainer').on('click', "#divTooMuch, #btnTooMuchRes", function () {
		// recherche des coordonnées en passant par Ajax
		var arrayTemp = [];
		// recuperation uniquement des IDs pour faire un JSON exploitable par
		// ajaxListEntsSelectSubmit.php
		for (var i = 0; i < tooMuchArray.length; i++) {
			arrayTemp.push(tooMuchArray[i].id);
		}
		//encodage en JSON
		var tooMuchJSON = JSON.stringify(arrayTemp);
		listEntsMaker('../outil_bi/ajaxListEntsSelectSubmit.php', tooMuchJSON);
	});

	//btn displayResults
	$('#displayResults').on('click', function () {
		// inverse affichage
		document
			.getElementById('entTabContainer')
			.style
			.display = 'block';
		document
			.getElementById('btnsGenerals')
			.style
			.display = 'none';
		document
			.getElementById('mapControls')
			.style
			.display = 'none';
		document
			.getElementById('navNiveauMap')
			.style
			.display = 'none';
		//				btnsDisplayNiveauMap("REG",btnNivMapRegID,btnNivMapRegNom,null,null,null);
	});
});

function userRightsManager() {
	$.ajax({
		url: '../outil_bi/ajaxUserNivPer.php',
		datatType: 'text',
		success: function (value) {
			var data = value.split("|");
			nivUser = data[0];
			//alert(nivUser);
			for (var i = 1; i < data.length; i++) {
				arrayBUs.push(data[i]);
				//alert(data[i]);
			}
			if (nivUser == "dirNat") {
				configbtnsNiveauMap();
				initMapFrance();
			}
			if (nivUser == "dirReg") {
				//alert(arrayBUs.length);
				if (arrayBUs.length == 1) {
					configbtnsNiveauMap();
					initMapRegion(arrayBUs[0]);
				}
			}
			if (nivUser == "bu") {
				if (arrayBUs.length == 1) {
					// ajax comme ajaxJSONRegionsMarker mais sur codeBU retourne string de data a
					// splicer => params de initBU
					configbtnsNiveauMap();
					//alert(arrayBUs[0]);
					uniquBU(arrayBUs[0]);
					//creation de la BU
				} else {
					//configbtnsNiveauMap(); créa de plusieurs BUS
					multipBU(JSON.stringify(arrayBUs));
				}
			}
		}
	});
}

function uniquBU(BU_ID) {
	$.ajax({
		type: 'POST',
		url: '../outil_bi/ajaxBUMarker.php',
		data: 'entreprise_id=' + BU_ID,
		success: function (value) {
			var data = value.split("|");
			var latitudeBU = data[0];
			var longitudeBU = data[1];
			var popupContent = data[2];
			var BusID = data[3];
			initMapBU(latitudeBU, longitudeBU, popupContent, BusID, "N");
			autoViewCenter(arrayLatLong);
			listEntsMaker('../outil_bi/ajaxListEnts.php', BusID);
			RAZficheEntreprise();
			btnsDisplayNiveauMap("F", btnNivMapRegID, btnNivMapRegNom, popupContent, latitudeBU, longitudeBU);
		}
	});
}

function multipBU(arrayBU) {
	arrayLatLong = [];
	$.ajax({
		type: 'POST',
		url: '../outil_bi/ajaxJSONBUMarkers.php',
		data: 'BUS_id=' + arrayBU,
		dataType: 'JSON',
		success: function (data) {
			//pour fonctionner le JSON renvoyer doit être Stringifyer
			var objBus = JSON.parse(JSON.stringify(data));
			for (var i = 0; i < objBus.length; i++) {
				BUsMarkers.push(createMarkerOnMap(objBus[i].latitude, objBus[i].longitude, objBus[i].libbu, objBus[i].libbu, IconMaker("Actual", null), objBus[i].id, "A", null));
				//						alert(objBus[i].codebu);
				arrayLatLong.push([objBus[i].latitude, objBus[i].longitude]);
			}
			// bouton de retour vers vue plusieurs BU
			$('#navNiveauMap').html('<button id="btnMultiBUs" onsubmit="javascript:userRightsManager();" style="displ' +
				'ay: none"></button>');
			btnMultiBU = document.getElementById('btnMultiBUs');
			autoViewCenter(arrayLatLong);
		}
	});
}

function initMapFrance() {
	$.ajax({
		url: '../outil_bi/ajaxJSONFRMarkers.php',
		dataType: 'JSON',
		success: function (data) {
			//pour fonctionner le JSON renvoyer doit être Stringifyer
			var obj = JSON.parse(JSON.stringify(data));
			//boucle sur le tableau des regions
			for (var i = 0; i < obj.length; i++) {
				regionMarkers.push(createMarkerOnMap(obj[i].latitude, obj[i].longitude, obj[i].libregion, null, IconMaker("region", obj[i].coderegion), obj[i].coderegion, "R", obj[i].zoom));
				mymap.addLayer(regionMarkers[i]);
			}
			btnsDisplayNiveauMap("REG", regionID, btnNivMapRegNom, null, null, null);
		}
	});
	mymap.setView([
		centreFRLat, centreFRLong
	], 6);
}

/**
 * Fonction de zoom et sélection eds agences de la région choise
 * A FAIRE : Ajout du paramètre zoom depuis BDD
 */
function initMapRegion(regionID) {
	//Ajout des marqueurs des agences depuis JSON
	arrayLatLong = [];
	$.ajax({
		type: 'POST',
		url: '../outil_bi/ajaxJSONRegionsMarker.php',
		data: 'region_id=' + regionID,
		dataType: 'JSON',
		success: function (data) {
			//pour fonctionner le JSON renvoyer doit être Stringifyer
			var objBus = JSON.parse(JSON.stringify(data));
			for (var i = 0; i < objBus.length; i++) {
				BUsMarkers.push(createMarkerOnMap(objBus[i].latitude, objBus[i].longitude, objBus[i].libbu, objBus[i].libbu, IconMaker("Actual", null), objBus[i].id, "A", null));
				//						alert(objBus[i].codebu);
				arrayLatLong.push([objBus[i].latitude, objBus[i].longitude]);
			}
			//alert(objBus[0].libregion);
			btnNivMapRegNom = objBus[0].libregion;
			if (regionID != 21) {
				if (arrayLatLong.length > 0) {
					autoViewCenter(arrayLatLong);
					// alert("lg du tab des markers d'ent : "+arrayLatLong.length);
					// autoZoom(arrayLatLong);
				}
			} else {
				mymap.setView([
					13.06667, -59.53333
				], 5);
			}
			btnsDisplayNiveauMap("REG", regionID, btnNivMapRegNom, null, null, null);
		}
	});
}

function initMapBU(latitude, longitude, popucontent, BUsID, isFromMap) {
	// Génération de la liste des entreprise rattachées
	if (popUpBU == " ") {
		popUpBU = " <div style='display: flex;flex-direction: column;justify-content: space-around'" +
			">						<span style='font-size:1.2em;text-align: center'>" + popucontent + "</span>						<span style='font-size:0.8em;text-align: center'>Cliquez pour obten" +
			"ir</span>						<span style='font-size:0.8em;text-align: center'>les stats de cet" +
			"te BU</span></div>";
	}

	if (uniqueBU == " ") {
		//nettoyage tableau des latlong du dernier groupe de markers produit
		arrayLatLong = [];
		arrayLatLong.push([latitude, longitude]);
		uniqueBU = createMarkerOnMap(latitude, longitude, popUpBU, popucontent, IconMaker("Actual", null), BUsID, "A");
	}
	//a executer seulement si selec agence depuis carte (flag)
	if (isFromMap == "Y") {
		document
			.getElementById('displayResults')
			.innerHTML = "Afficher les " + resultsNumber + " résultats";
		listEntsMaker('../outil_bi/ajaxListEnts.php', BUsID);
		RAZficheEntreprise();
		mymap.setView([
			latitude, longitude
		], 13);
	}
}

function listEntsMaker(AjaxUrl, CodeID) {
	var msg = "entreprises rattachées à cette Business Unit";
	if (AjaxUrl == '../outil_bi/ajaxListEntsSelectSubmit.php') {
		msg = "résultats";
	}
	$.ajax({
		type: 'POST',
		url: AjaxUrl,
		data: 'code_id=' + CodeID,
		success: function (html) {
			$('#entTabContainer').html(html);
			$("#tableEntreprises").DataTable({
				language: {
					processing: "Traitement en cours...",
					search: "Rechercher&nbsp;:",
					lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
					info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacut" +
					"e;ments",
					infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
					infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
					infoPostFix: "",
					loadingRecords: "Chargement en cours...",
					zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
					emptyTable: "Aucune donnée disponible dans le tableau",
					paginate: {
						first: "Premier",
						previous: "Pr&eacute;c&eacute;dent",
						next: "Suivant",
						last: "Dernier"
					},
					aria: {
						sortAscending: ": activer pour trier la colonne par ordre croissant",
						sortDescending: ": activer pour trier la colonne par ordre décroissant"
					}
				}
			});
			//reglage du bouton de redeploiement de la liste
			var table = $('#tableEntreprises').DataTable();
			var resultsNumber = table
				.column(0)
				.data()
				.length;
			document
				.getElementById('displayResults')
				.innerHTML = "Afficher les " + resultsNumber + " " + msg;
			document
				.getElementById('entTabContainer')
				.style
				.display = 'none';
			document
				.getElementById('btnsGenerals')
				.style
				.display = 'flex';
			document
				.getElementById('mapControls')
				.style
				.display = 'block';
			clearNotice();
		}
	});
}

/**
 * Createur d'icone qui rassemble les icones Actual, Factory et régions
 * Param : Selecteur (Actual, Region, ou Factory) -> Dimensions en dur
 * 			Url Icone & Url Shadow à mettre en variable globales au début du script
 */
function IconMaker(type, iconType) {
	var icon;
	if (type == "factory") {
		icon = L.icon({
			iconUrl: '../outil_bi/images/factory-marker.png',
			shadowUrl: '../outil_bi/images/factory-marker-shadow.png',
			iconSize: [
				36, 49
			], // size of the icon
			shadowSize: [
				73, 49
			], // size of the shadow
			iconAnchor: [
				18, 49
			], // point of the icon which will correspond to marker's location
			shadowAnchor: [
				36, 50
			], // the same for the shadow
			popupAnchor: [2, -49] // point from which the popup should open relative to the iconAnchor
		});
	}
	if (type == "Actual") {
		icon = L.icon({
			iconUrl: '../outil_bi/images/Actual-marker.png',
			shadowUrl: '../outil_bi/images/Actual-marker-shadow.png',
			iconSize: [
				38, 50
			], // size of the icon
			shadowSize: [
				90, 52
			], // size of the shadow
			iconAnchor: [
				19, 50
			], // point of the icon which will correspond to marker's location
			shadowAnchor: [
				45, 50
			], // the same for the shadow
			popupAnchor: [2, -50] // point from which the popup should open relative to the iconAnchor
		});
	}
	if (type == "region") {
		if (iconType != 21) {
			icon = L.icon({
				iconUrl: '../outil_bi/images/region-' + iconType + '-marker.png',
				shadowUrl: '../outil_bi/images/region-marker-shadow.png',
				iconSize: [
					180, 104
				], // size of the icon
				shadowSize: [
					180, 104
				], // size of the shadow
				iconAnchor: [
					90, 104
				], // point of the icon which will correspond to marker's location
				shadowAnchor: [
					90, 104
				], // the same for the shadow
				popupAnchor: [2, -104] // point from which the popup should open relative to the iconAnchor
			});
		} else {
			icon = L.icon({
				iconUrl: '../outil_bi/images/region-' + iconType + '-marker.png',
				shadowUrl: '../outil_bi/images/region-21-marker-shadow.png',
				iconSize: [
					180, 104
				], // size of the icon
				shadowSize: [
					180, 104
				], // size of the shadow
				iconAnchor: [
					90, 104
				], // point of the icon which will correspond to marker's location
				shadowAnchor: [
					90, 104
				], // the same for the shadow
				popupAnchor: [2, -104] // point from which the popup should open relative to the iconAnchor
			});
		}
	}
	return icon;
};

function createMarkerOnMap(latitude, longitude, popupContent, libBU, icon, CodeID, type) {
	//Ajout du marker
	var marker = L.marker([
		latitude, longitude
	], {icon: icon})
		.addTo(mymap)
		.bindPopup(popupContent);
	marker.on('mouseover', function (e) {
		this.openPopup();
	});
	marker.on('mouseout', function (e) {
		this.closePopup();
	});

	//selecteur pour choix de la fonction lors du clic sur marker
	if (type == "R") {
		marker
			.on('click', function (e) {
				btnsDisplayNiveauMap("REG", btnNivMapRegID, btnNivMapRegNom, null, null, null);
				deleteRegionMarkers();
				initMapRegion(CodeID);
				autoViewCenter(arrayLatLong);
			});
	}
	if (type == "A") {
		marker
			.on('click', function (e) {
				btnsDisplayNiveauMap("BU", btnNivMapRegID, btnNivMapRegNom, libBU, latitude, longitude);
				deleteBUsMarkers();
				initMapBU(latitude, longitude, popupContent, CodeID, "Y");
				$('#mapid').width("100%");
				autoViewCenter(arrayLatLong);
				if (btnMultiBU != "") {
					btnMultiBU.innerHTML = "Mes " + arrayBUs.length + " Business Units";
					btnMultiBU.style.display = 'block';
				}
			});
	}
	if (type == "F") {
		marker
			.on('click', function (e) {
				if (btnNivMapRegNom != null && btnNivMapBUNom != null) {
					btnsDisplayNiveauMap("F", btnNivMapRegID, btnNivMapRegNom, btnNivMapBUNom, latBU, longBU);
				}
				displayFicheEntreprise(CodeID);
				mymap.setView([
					latitude, longitude
				], 13);
			});
	}
	return marker;
}

function RAZficheEntreprise() {
	var raz = "RAZ";
	$.ajax({
		type: 'POST',
		url: '../outil_bi/ajaxFicheEntreprise.php',
		data: 'entreprise_id=' + raz,
		success: function (html) {
			$('#entrepriseData').html(html);
		}
	});
}

function displayFicheEntreprise(entrepriseID) {
	// Génération de la fiche de l'entreprise
	$.ajax({
		type: 'POST',
		url: '../outil_bi/ajaxFicheEntreprise.php',
		data: 'entreprise_id=' + entrepriseID,
		success: function (html) {
			$('#entrepriseData').html(html);
			clearFiche();
			displayBtnSaveFiche(entrepriseID);
			autoViewCenter(arrayLatLong);
			autoSetMapHeight();
			//alert($('#mapid').height()); alert(Math.round($('#fiche').height()));
		}
	});
}

/**
 * Fonction de remplissage de la liste a partir d'un tableau des elemnts du selct
 * Vers un 	jx qui remplit la liste "entreprises"
 * @param theForm
 */
function validateFormOnSubmit() {
	//nettoyage tableau des latlong du dernier groupe de markers produit
	arrayLatLong = [];
	// moteur de recherche produite des markers selon mot dans l'input
	var search = document
		.getElementById('selectEnt')
		.value;
	if (search) {
		// suppression des markers précédents
		deleteRegionMarkers();
		deleteBUsMarkers();
		deleteFactoryMarkers();
		deleteUniqueBU();
		$('#entTabContainer').empty();
		document
			.getElementById('mapControls')
			.style
			.display = 'none';
		document
			.getElementById('entTabContainer')
			.style
			.display = 'block';
		RAZficheEntreprise();
		initMapFrance();
		btnsDisplayNiveauMap("REG", btnNivMapRegID, btnNivMapRegNom, null, null, null);
		$.ajax({
			type: 'POST',
			url: '../outil_bi/ajaxSEQuery.php',
			data: 'search=' + search,
			dataType: 'JSON',
			success: function (data) {
				//pour fonctionner le JSON renvoyer doit être Stringifyer
				var objBus = JSON.parse(JSON.stringify(data));
				tooMuchArray = objBus;
				//Test longueur du tableau
				if (objBus.length == 0) {
					$('#entTabContainer').html(
						//produit HTML :Message + bouton pour lancer création tableau
						"<label style='margin-left: 5%;height: 100%;display: flex;align-items: center;jus" +
						"tify-content: center;'>Nous n'avons pas trouvé de résultats : essayez des termes" +
						" différents</label>");
				} else if (objBus.length >= 20 && objBus.length < 1000) {
					$('#entTabContainer').html(
						//produit HTML :Message + bouton pour lancer création tableau
						"<div id='divTooMuch' style='display: flex; flex-direction: row; align-content: s" +
						"pace-between'><span style='margin-left: 5%;height: 100%;display: flex;align-item" +
						"s: center;justify-content: center;'>Nous avons trouvé plus de 20 résultats : aff" +
						"iner votre recherche ou </span><button style='margin-left: 2%;padding: 2px 42px;" +
						"border-radius: 10px;' id='btnTooMuchRes'>Génerer une liste</button></div>");
				} else if (objBus.length > 1000) {
					$('#entTabContainer').html(
						//produit HTML :Message + bouton pour lancer création tableau
						"<div id='divTooMuch' style='display: flex; flex-direction: row; align-content: s" +
						"pace-between'><span style='margin-left: 5%;height: 100%;display: flex;align-item" +
						"s: center;justify-content: center;'>Plus de 1000 résultats. Merci d'affiner votr" +
						"e recherche</span></div>");
				} else {
					for (var i = 0; i < objBus.length; i++) {
						factoryMarkers.push(createMarkerOnMap(objBus[i].latitude, objBus[i].longitude, objBus[i].nom, null, IconMaker("factory", null), objBus[i].id, "F", null));
						arrayLatLong[i] = ([objBus[i].latitude, objBus[i].longitude]);
					}
				}
				if (arrayLatLong.length > 0) {
					autoViewCenter(arrayLatLong);
					//							alert(arrayLatLong.length); 							autoZoom(arrayLatLong);
				}
			}
		});
	}
}

function infosEnts(param) {
	deleteRegionMarkers();
	var entrepriseID = $(param).val();
	//création du marker de l'entreprise
	$.ajax({
		type: 'POST',
		url: '../outil_bi/ajaxEntrepriseMarker.php',
		data: 'entreprise_id=' + entrepriseID,
		success: function (value) {
			var data = value.split("|");
			var latitudeEntreprise = data[0];
			var longitudeEntreprise = data[1];
			var popupContent = data[2];
			factoryMarkers.push(createMarkerOnMap(latitudeEntreprise, longitudeEntreprise, popupContent, null, IconMaker("factory", null), entrepriseID, "F", null));
			displayFicheEntreprise(entrepriseID);
			//centrage de la catre
			arrayLatLong.push([latitudeEntreprise, longitudeEntreprise]);
			if (arrayLatLong.length > 0) {
				autoViewCenter(arrayLatLong);
				// alert("lg du tab des markers d'ent : "+arrayLatLong.length);
				// autoZoom(arrayLatLong);
			}
		}
	});
}

function deleteRegionMarkers() {
	for (var i = 0; i < regionMarkers.length; i++) {
		mymap.removeLayer(regionMarkers[i]);
	}
}

function deleteBUsMarkers() {
	if (Array.isArray(BUsMarkers) && BUsMarkers.length) {
		for (var i = 0; i < BUsMarkers.length; i++) {
			mymap.removeLayer(BUsMarkers[i]);
		}
	}
}

function deleteUniqueBU() {
	if (uniqueBU != " ") {
		mymap.removeLayer(uniqueBU);
		uniqueBU = " ";
		popUpBU = " ";
	}
}

function deleteFactoryMarkers() {
	if (Array.isArray(factoryMarkers) && factoryMarkers.length) {
		for (var i = 0; i < factoryMarkers.length; i++) {
			mymap.removeLayer(factoryMarkers[i]);
		}
	}
}

function clearInput() {
	// clearable input
	jQuery(function ($) {
		// CLEARABLE INPUT
		function tog(v) {
			return v
				? 'addClass'
				: 'removeClass';
		}
		$(document)
			.on('input', '.clearable', function () {
				$(this)[tog(this.value)]('x');
			})
			.on('mousemove', '.x', function (e) {
				$(this)[tog(this.offsetWidth - 36 < e.clientX - this.getBoundingClientRect().left)]('onX');
			})
			.on('touchstart click', '.onX', function (ev) {
				ev.preventDefault();
				$(this)
					.removeClass('x onX')
					.val('')
					.change();
			});
	});
}

function clearFiche() {
	var btn = document.getElementById('btnCloseFiche');
	btn.onclick = function (e) {
		RAZficheEntreprise();
		$('#entrepriseData').empty();
		$('#mapid').width("100%");
		autoViewCenter(arrayLatLong);
	};
}

function clearNotice() {
	var btn = document.getElementById('btnCloseNotice');
	btn.onclick = function (e) {
		RAZficheEntreprise();
		$('#notice').empty();
		//$('#mapid').width("100%"); autoViewCenter(arrayLatLong);
	};
}

function displayBtnSaveFiche(entrepriseID) {
	var input = document.getElementById('inputFiche');
	var select = document.getElementById('selectFiche');
	input.oninput = function (e) {
		document
			.getElementById('btnSaveFiche')
			.style
			.display = 'block';
		autoSetMapHeight();
		saveFiche(entrepriseID, input, select);
	};
	select.onchange = function (e) {
		document
			.getElementById('btnSaveFiche')
			.style
			.display = 'block';
		autoSetMapHeight();
		saveFiche(entrepriseID, input, select);
	};
}

function saveFiche(entrepriseID, input, select) {
	var btnSaveFiche = document.getElementById('btnSaveFiche');
	var queryValues = [];
	btnSaveFiche.onclick = function (e) {
		// recup valeur input et valeur select
		queryValues.push(entrepriseID);
		var inputValue = input.value;
		var selectValue = select.options[select.selectedIndex].value;
		queryValues.push(inputValue);
		queryValues.push(selectValue);
		var entIDuserIDuserNomConcat = JSON.stringify(queryValues);
		// envoi vers ajax qui fait l'insert (controle que input = nums et protege des
		// injections SQL)
		$.ajax({
			type: 'POST',
			url: '../outil_bi/ajaxInsertFromFiche.php',
			data: 'idNomConcat=' + entIDuserIDuserNomConcat,
			dataType: 'text',
			success: function (html) {
				alert('Vos modifications ont bien été enregistrées !');

			}
		});
	};
}

/**
 * Get a center latitude,longitude from an array of like geopoints
 *
 * @param array data 2 dimensional array of latitudes and longitudes
 * For Example:
 * $data = array
 * (
 *   0 = > array(45.849382, 76.322333),
 *   1 = > array(45.843543, 75.324143),
 *   2 = > array(45.765744, 76.543223),
 *   3 = > array(45.784234, 74.542335)
 * );
 */
function GetCenterFromDegrees(data) {
	if (!(data.length > 0)) {
		return false;
	}

	var num_coords = data.length;

	var X = 0.0;
	var Y = 0.0;
	var Z = 0.0;

	for (i = 0; i < data.length; i++) {
		var lat = data[i][0] * Math.PI / 180;
		var lon = data[i][1] * Math.PI / 180;

		var a = Math.cos(lat) * Math.cos(lon);
		var b = Math.cos(lat) * Math.sin(lon);
		var c = Math.sin(lat);

		X += a;
		Y += b;
		Z += c;
	}

	X /= num_coords;
	Y /= num_coords;
	Z /= num_coords;

	var lon = Math.atan2(Y, X);
	var hyp = Math.sqrt(X * X + Y * Y);
	var lat = Math.atan2(Z, hyp);

	var newX = (lat * 180 / Math.PI);
	var newY = (lon * 180 / Math.PI);

	return new Array(newX, newY);
}

function autoZoom(data) {
	if (!(data.length > 0)) {
		return false;
	}
	var minLat = data[0][0];
	var maxLat = data[0][0];
	var minLong = data[0][1];
	var maxLong = data[0][1];

	var zoom;
	var prodMax = 0;

	for (i = 0; i < data.length; i++) {
		if (data[i][0] < minLat) {
			minLat = data[i][0];
		}
		if (data[i][0] > maxLat) {
			maxLat = data[i][0];
		}
		if (data[i][1] < minLong) {
			minLong = data[i][1];
		}
		if (data[i][1] > maxLong) {
			maxLong = data[i][1];
		}
	}

	var prodLat = maxLat - minLat;
	var prodLong = maxLong - minLong;
	if (prodLat < 0) {
		prodLat = Math.abs(prodLat);
	}
	if (prodLong < 0) {
		prodLong = Math.abs(prodLong);
	}

	prodMax = prodLat;
	if (prodLong > prodMax) {
		prodMax = prodLong;
	}

	if (prodMax < 0.1) {
		zoom = 11;
	}
	if (prodMax > 0.1 && prodMax < 0.7) {
		zoom = 10;
	}
	//a affiner
	if (prodMax > 0.7 && prodMax < 1.15) {
		zoom = 9;
	}
	if (prodMax > 1.15 && prodMax < 1.8) {
		zoom = 8;
	}
	if (prodMax > 1.8 && prodMax < 4.25) {
		zoom = 7;
	}
	if (prodMax > 4.25 && prodMax < 14) {
		zoom = 6;
	}
	if (prodMax > 14 && prodMax < 25) {
		zoom = 4;
	}
	return zoom;

}

function autoViewCenter(arrayMarkers) {
	//recentre la carte en cas de resize du container de la map
	setTimeout(function () {
		mymap.invalidateSize()
	}, 10);
	mymap.setView(GetCenterFromDegrees(arrayMarkers), autoZoom(arrayMarkers));
}

function autoSetMapHeight() {
	$('#mapid').width("52%");
	$('#fiche').width("100%");
	$('#mapid').height(Math.round($('#fiche').height()));
}

function configbtnsNiveauMap() {
	var btnsNiveauMapDiv = document.getElementById('navNiveauMap');
	if (nivUser == "dirNat") {
		$('#navNiveauMap').html("<button id='btnNivFR'>France</button><button id='btnNivRegion'>Region</button><b" +
			"utton id='btnNivBU'>Business Unit</button>");
		btnFR = document.getElementById('btnNivFR');
		btnREG = document.getElementById('btnNivRegion');
		btnBU = document.getElementById('btnNivBU');
	} else if (nivUser == "dirReg") {
		//alert("ok");
		$('#navNiveauMap').html("<button id='btnNivRegion'>Region</button><button id='btnNivBU'>Business Unit</bu" +
			"tton>");
		btnREG = document.getElementById('btnNivRegion');
		btnBU = document.getElementById('btnNivBU');
	} else {
		$('#navNiveauMap').html("<button id='btnNivBU'>Business Unit</button>");
		btnBU = document.getElementById('btnNivBU');
	}
}

function btnsDisplayNiveauMap(niveau, regionID, regNom, BUnom, latitude, longitude) {
	btnNivMapRegID = regionID;
	latBU = latitude;
	longBU = longitude;
	btnNivMapRegNom = regNom;
	btnNivMapBUNom = BUnom;
	if (btnREG != "") {
		btnREG.innerHTML = "Région " + btnNivMapRegNom;
	}
	if (btnBU != "") {
		btnBU.innerHTML = "Agence " + btnNivMapBUNom;
	}
	if (niveau == "REG") {
		if (btnFR != "") {
			btnFR.style.display = 'block';
		}
		if (btnREG != "") {
			btnREG.style.display = 'none';
		}
		if (btnBU != "") {
			btnBU.style.display = 'none';
		}
	}
	if (niveau == "BU") {
		if (btnFR != "") {
			btnFR.style.display = 'block';
		}
		if (btnREG != "") {
			btnREG.style.display = 'block';
		}
		if (btnBU != "") {
			btnBU.style.display = 'none';
		}
	}
	if (niveau == "F") {
		if (btnFR != "") {
			btnFR.style.display = 'block';
		}
		if (btnREG != "") {
			btnREG.style.display = 'block';
		}
		if (btnBU != "") {
			btnBU.style.display = 'block';
		}

	}
	// methode de btnFR
	btnFR.onclick = function (e) {
		deleteRegionMarkers();
		deleteBUsMarkers();
		deleteUniqueBU();
		deleteFactoryMarkers();
		initMapFrance();
		$('#mapid').width("100%");
		RAZficheEntreprise();
		btnFR.style.display = 'none';
		btnREG.style.display = 'none';
		btnBU.style.display = 'none';
		document
			.getElementById('mapControls')
			.style
			.display = 'none';
		setTimeout(function () {
			mymap.invalidateSize()
		}, 400);
		// efface l'input
		$('#selectEnt').val('');
		//				location.reload(true);
	};
	// methode de btnFR
	btnREG.onclick = function (e) {
		deleteRegionMarkers();
		deleteBUsMarkers();
		deleteUniqueBU();
		deleteFactoryMarkers();
		initMapRegion(btnNivMapRegID);
		$('#mapid').width("100%");
		RAZficheEntreprise();
		//				alert("l'ID de la région est : "+btnNivMapRegID);
		btnFR.style.display = 'block';
		btnREG.style.display = 'none';
		btnBU.style.display = 'none';
		document
			.getElementById('mapControls')
			.style
			.display = 'none';
	};
	// methode de btnBU
	btnBU.onclick = function (e) {
		mymap.setView([
			latBU, longBU
		], 13);
		btnFR.style.display = 'block';
		btnREG.style.display = 'block';
		btnBU.style.display = 'none';
	};
	btnMultiBU.onclick = function (e) {
		arrayBUs = [];
		deleteUniqueBU();
		deleteFactoryMarkers();
		userRightsManager();
		$('#mapid').width("100%");
		RAZficheEntreprise();
	}

}
