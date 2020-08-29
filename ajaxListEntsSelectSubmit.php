<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
//on doit recevoir un json depuis le JS le traduire en array d'IDs
// et boucler dessus pour remplir un nouveau tableua qui remplace $query
//$id = $_POST["code_id"];

$arrayID = json_decode($_POST['code_id']);

$queries = array();
foreach($arrayID as $id) {
    $queries[] = $BDD->getrow("SELECT id,
                        raison_sociale as raisonSociale,
                        id_activite_actual as secteur,
                        ptt_ca as potentiel,
                        statut,
                        grandcompte,
                        adresse_ville as ville,
                        distance
                        FROM politicco_corporama
                        WHERE id =".$id);
}

$secteur_actual=$BDD->getall("select id_activite_actual as id,lib_activite_actual as lib from dim_ape_naf group by id_activite_actual order by lib_activite_actual");

foreach($secteur_actual as $s1){
    $key=$s1['id'];
    $tablo_secteur[$key]['id']=$key;
    $tablo_secteur[$key]['lib']=$s1['lib'];

}

if(!empty($arrayID)) {
    echo '
		<table id="tableEntreprises" class="tableEntreprises display">
			<thead>
				<tr>
					<th>Raison sociale</th>
					<th>Secteur</th>
                    <th>Statut</th>
                    <th>Grand Compte</th>
					<th>'.utf8_encode("Pot. Ca estimé").'</th>
					<th>Ville</th>
					<th>Distance</th>
				</tr>
			</thead>
			<tbody id="entreprises" data-value="">
    ';
    foreach($queries as $row){
        echo '
            <tr>
                <td><button id="entrepriseID" value="'.$row['id'].'">'.tronquer($row['raisonSociale'],30).'</td>
                <td>'.$tablo_secteur[$row['secteur']]['lib'].'</td>
                <td>'.$row['statut'].'</td>
                <td>'.$row['grandcompte'].'</td>
                <td align="right">'.number_format($row['potentiel'],0, '.', ' ').'</td>
                <td>'.$row['ville'].'</td>
                <td align="right">'.$row['distance'].'</td>
            </tr>
        ';
    }
    echo '
	        </tbody>
        </table>
    ';
}else{
    echo 'çà déconne';
}
?>


