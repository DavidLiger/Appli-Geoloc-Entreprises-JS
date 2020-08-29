<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$q = $_GET['q'];

if(isset($_GET['q'])){
    $query = $BDD->getall("SELECT id, raison_sociale, naf_lib_global, adresse_ville, telephone, dirigeant_nom FROM politicco_corporama
                          WHERE raison_sociale LIKE '%".$q ."%'
                          OR lib_sec_corporama LIKE '%".$q."%'
                          OR naf_lib_global LIKE '%".$q."%'
                          OR cpostal LIKE '%".$q."%'
                          OR adresse_ville LIKE '%".$q."%'
                          OR telephone LIKE '%".$q."%'
                          OR dirigeant_nom LIKE '%".$q."%'
                          GROUP BY raison_sociale, lib_sec_corporama,
                          naf_lib_global, cpostal, adresse_ville, telephone, dirigeant_nom
                          ");
    $array = array();
    foreach($query as $row){
        $id = $row['id'];
        $nom = $row['raison_sociale']." ".$row['naf_lib_global']." ".$row['adresse_ville']." ".$row['telephone']." ".$row['dirigeant_nom'];
        $array[]=array('id'=>$id,'text'=>$nom);
    }
    echo json_encode($array);
}

?>