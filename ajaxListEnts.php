<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

//setlocale(LC_TIME, 'fr_FR.utf8','fra');



$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$id = $_POST["code_id"];
$codebu = $BDD->getRow("SELECT codebu, libbu FROM politico_bu WHERE id =".$id);



$query = $BDD->getall("SELECT id,
                        raison_sociale as raisonSociale,
                        id_activite_actual as secteur,
                        round(ptt_ca/1000,0) as potentiel,
                        statut,
                        grandcompte,
                        adresse_ville as ville,
                        distance
                        FROM politicco_corporama
                        WHERE codebu LIKE '%".$codebu['codebu']."%'");

$secteur_actual=$BDD->getall("select id_activite_actual as id,lib_activite_actual as lib from dim_ape_naf group by id_activite_actual order by lib_activite_actual");

    foreach($secteur_actual as $s1){
        $key=$s1['id'];
        $tablo_secteur[$key]['id']=$key;
        $tablo_secteur[$key]['lib']=$s1['lib'];
    }

if(!empty($codebu)) {
    echo '
        <div style="display: flex; flex-direction: row">
            <label style="color: white;background-color: #708090;
			border-radius: 5px;
			padding: 2%;">'.$codebu['libbu'].'
			</label>
			<div id="notice">
			    <label style="color: white;background-color: #708090;color: white; font-size: 0.8em;
			border-radius: 5px;
			padding: 2%;margin-left:1%"><button id="btnCloseNotice">&times;</button>Voici la liste des entreprises rattachées à votre Bu.
			Pour trier, cliquez sur les libellés de colonne.<br/> Le champ "Rechercher" vous autorise la saisie de plusieurs mots ( séparés par des espaces ).
            La liste se remet à jour automatiquement au fur et à mesure de votre saisie.
            <br/>Cliquez sur une entreprise pour voir le détail et la cibler. La liste sera à nouveau disponible en
			 cliquant sur le bouton "Afficher les ... entreprises rattachées à cette Bu
			 </label>
			</div>
        </div>
		<table id="tableEntreprises" class="tableEntreprises display">
			<thead>
				<tr>
					<th>Raison sociale</th>
					<th>Secteur</th>
                    <th>Statut</th>
                    <th>Acc. nat</th>
					<th>'.utf8_encode("Pot. Ca estime (Keuros)").'</th>
					<th>Ville</th>
					<th>Distance</th>
				</tr>
			</thead>
			<tbody id="entreprises" data-value="">
    ';
    foreach($query as $row){
        echo '
            <tr>
                <td><button id="entrepriseID" value="'.$row['id'].'">'.tronquer($row['raisonSociale'],30).'</td>
                <td>'.$tablo_secteur[$row['secteur']]['lib'].'</td>
                <td>'.$row['statut'].'</td>
                <td>'.$row['grandcompte'].'</td>
                <td align="right">'.$row['potentiel'].'</td>
                <td>'.$row['ville'].'</td>
                <td align="right">'.$row['distance'].'</td>
            </tr>
        ';
    }
    echo '
	        </tbody>
        </table>
    ';
}
?>


