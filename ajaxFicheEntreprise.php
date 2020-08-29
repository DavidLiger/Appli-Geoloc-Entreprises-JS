<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

//setlocale(LC_TIME, 'fr_FR.utf8','fra');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$id = $_POST["entreprise_id"];
$enjeu = "";
$secteur = "";
$grandCompte = "";
$BUPersonnels = array();
$persosOptions = "";

if($id != "RAZ"){
    $query = $BDD->getrow("SELECT id, raison_sociale, effectif_etablissement,
                        adresse_complete, telephone,  dirigeant_civilite,
                        dirigeant_prenom , dirigeant_nom, ptt_ca, idtranche, ptv_ca, id_activite_actual,
                        budget, ca, ptv_ca, grandcompte, statut, codebu
                        FROM politicco_corporama
                        WHERE id =".$id);

	$secteur = $BDD->getone("SELECT lib_activite_actual
                        FROM dim_ape_naf
                        WHERE id_activite_actual =".$query["id_activite_actual"]);

	//récupération des personnels de l'agence
	$BUPersosQuery = $BDD->getall("SELECT id, nom_prenom FROM politico_responsable WHERE codebu = '".$query["codebu"]."'");
	foreach($BUPersosQuery as $rowPerso){
		$persosOptions .= "<option value=".$rowPerso["id"].">".$rowPerso["nom_prenom"]."</option>";
	}

	if($query['idtranche'] == 3){
		$enjeu = "Enjeu stratégique";
	}

	if($query['idtranche'] == 2){
		$enjeu = "Enjeu 2";
	}

	if($query['idtranche'] == 1){
		$enjeu = "Enjeu 1";
	}

	// ICI tu peux changé la condition
	// qui déclenche l'édition de la rangée supplémentaire dans la table
	$grandCompte = $query['grandcompte'];
	if($grandCompte != ""){
		$grandCompte = '<tr>
							<th>'.utf8_encode("Rattach. Acc Nat").'</th>
							<td>'.$query['grandcompte'].'</td>
						</tr>';
	}

//    $dateDeCrea = 'le '.date("d", strtotime($query['date_creation'])).' '.strftime("%B", strtotime($query['date_creation'])).' '.date("Y", strtotime($query['date_creation']));

    if(!empty($id)) {
        echo '
<table id="fiche">
	<tr>
		<th>'.utf8_encode("Raison Sociale").'</th>
		<td>'.$query['raison_sociale'].'<button id="btnCloseFiche">&times;</button></td>
	</tr>
	<tr>
		<th>'.utf8_encode("Secteur").'</th>
		<td>'.$secteur.'</td>
	</tr>
	<tr>
		<th>'.utf8_encode("Effec. Etabliss.").'</th>
		<td>'.$query['effectif_etablissement'].'</td>
	</tr>
	<tr>
		<th>'.utf8_encode("Adresse").'</th>
		<td>'.$query['adresse_complete'].'</td>
	</tr>
	
	<tr>
		<th>'.utf8_encode("Dirigeant + Tél").'</th>
		<td>'.$query['dirigeant_civilite'].' '.$query['dirigeant_prenom'].' '.$query['dirigeant_nom'].' '.$query['telephone'].'</td>
	</tr>
	'.$grandCompte.'
	<tr>
		<th>'.utf8_encode("Pot. Ca Estimé").'</th>
		<td>'.number_format($query['ptt_ca'],0, '.', ' ').' Euros ('.$query['statut'].')</td>
	</tr>
	<tr>
		<th>'.utf8_encode("CA réalisé 2019").'</th>
		<td>'.$query['ca'].'</td>
	</tr>
	
	<tr>
		<th>'.utf8_encode("Ca budgeté 2020 (Euros)").'</th>
		<td><input id="inputFiche" type="text" value="'." ".$query['budget'].'" style="color: black"></td>
	</tr>
    
    

    <tr>
		<th>'.utf8_encode("Responsable").'</th>
		<td>
            <select id="selectFiche">
                '.$persosOptions.'
            </select>
        </td>
	</tr>
    <tr>
		<th>'.utf8_encode("Rappel Segmentation").'</th>
		<td>'.utf8_encode("E1<100 000> E2 <300 000> ES").'</td>
	</tr>
	<tr>
		<th></th>
		<td id="validateRow"><button id="btnSaveFiche" style="float: right; display: none">Enregistrer</button></td>
	</tr>
</table>';
    }
}else{
    echo'<br/>';
}
?>