<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$search = $_POST['search'];
$arrayID = array();

if(isset($_POST['search'])){
    $search_exploded = explode ( " ", $search );
    $x = 0;
    $construct = "";
    foreach( $search_exploded as $search_each ) {
        $x++;
        if( $x == 1 )
            $construct .="CONCAT(raison_sociale,lib_sec_corporama,naf_lib_global,adresse_rue,departement,cpostal,adresse_ville,code_departement,adresse_DEP_nom,adresse_REGION_nom,libregion,libbu,villebu,telephone,dirigeant_nom) LIKE '%$search_each%' ";
        else
            $construct .="AND CONCAT(raison_sociale,lib_sec_corporama,naf_lib_global,adresse_rue,departement,cpostal,adresse_ville,code_departement,adresse_DEP_nom,adresse_REGION_nom,libregion,libbu,villebu,telephone,dirigeant_nom) LIKE '%$search_each%' ";
    }

    $construct = "SELECT id, raison_sociale AS nom, latitude, longitude FROM politicco_corporama WHERE $construct ";
    $query = $BDD->getall($construct);
    foreach($query as $row){
        $arrayID[]= $row;
    }
    echo json_encode($arrayID);
}
?>