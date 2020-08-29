<?php

require_once ('../fonction/base.php');require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_b.php');

global $a;
$connecte=$a->getAuthData('iduser');
$iduser= remplacant();


if(is_actual($iduser)==0){echo "not user";die;}

//DROIT ACCES
if('droit'=='droit'){
if(droit_acces($iduser,31)==0){echo "ACCES NON AUTORISE : => LOW BREACK";die;}
}
?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Les entreprises autour de ma Bu</title>
	<link rel="icon" type="image/ico" href="../tsecu2/images/Trefle-bleu-min.png" />
	<link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
	<link href="https://fonts.google.com/?selection.family=Lobster" rel="stylesheet">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
	<link rel="stylesheet" href="../outil_bi/css/stylesheet.css">

	<!-- Custom styles for this template-->
	<link href="../outil_bi/css/sb-admin-2.css" rel="stylesheet">
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.5.1/dist/leaflet.css" integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" crossorigin=""/>
	<link rel="stylesheet" href="../outil_bi/js/leaflet-routing-machine-3.2.12/dist/leaflet-routing-machine.css" />
	<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.20/css/jquery.dataTables.css">	<!-- Make sure you put this AFTER Leaflet's CSS -->
	<link href="https://cdn.jsdelivr.net/npm/select2@4.0.12/dist/css/select2.min.css" rel="stylesheet" />
</head>
<body>
<div id="particles-js"></div>

<div class="logoTitle">
	<div>
		<a href="https://ag01.travail-temporaire-online.fr/">
			<img id="logo" src="../outil_bi/images/fond-map.png">
		</a>
	</div>
	<div class="flex2">
		<h1>Les entreprises autour de ma Bu</h1>
		<h6><i>L'application qui vous permet de trouver des entreprises sur votre territoire</i></h6>
	</div>
</div>

<div id="searchDiv" style="display: none">
	<div class="search form-group">
		<form id="selecForm" action="#" onsubmit="javascript:validateFormOnSubmit();">
			<input type="text" name="" class="clearable" id="selectEnt" placeholder="Recherchez des entreprises par code postal, adresse, nom dirigeant, raison sociale...">
			<button type="submit" id="multiSelecOK">OK</button>
		</form>
	</div>
</div>

<div id="btnsGenerals">
	<button id="btnBack" title="Retour au menu" onclick="window.location.href = 'https://ag01.travail-temporaire-online.fr/outil_bi/00_menu_outil_politico.php?zoom=menu';"></button>
	<button id="btnStats" title="Analyse de mon marché" onclick="window.open('https://ag01.travail-temporaire-online.fr/outil_bi/ciblage_map.php', 'width=400,height=400')"></button>
</div>

<div id="mapControls">
	<button id="displayResults"></button>
</div>

<div class="flex2" id="entTabContainer"></div>

<div id="navNiveauMap"></div>

<div class="flex">
	<div id="mapid"></div>
	<div id="entrepriseData"></div>
</div>

<footer>
	<div id="footDiv">
		<div class="count-particles"> <span class="js-count-particles">--</span> particles </div>
		<span>Développé par</span>
		<a href="mailto:david.liger@groupeactual.eu">David Liger</a>
		<span>sous la responsabilité de</span>
		<a href="mailto:patrick.machecourt@groupeactual.eu">Patrick Machecourt</a>
		<span> | 2019</span>
	</div>
</footer>

<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script src="https://cdn.datatables.net/1.10.20/js/jquery.dataTables.min.js"></script>
<script src="/../outil_bi/js/leaflet.js"></script>
<script src="/../outil_bi/js/select2.min.js"></script>
<script src="/../outil_bi/js/factorySearchEngine.js"></script>
<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
<!--<script src="https://threejs.org/examples/js/libs/stats.min.js"></script>-->

</body>
</html>