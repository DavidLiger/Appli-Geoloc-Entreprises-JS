<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
//on doit recevoir un json depuis le JS le traduire en array d'IDs
// et boucler dessus pour remplir un nouveau tableua qui remplace $query
//$id = $_POST["code_id"];

$arrayID = json_decode($_POST['BUS_id']);

$queries = array();

foreach($arrayID as $id) {
    $queries[] = $BDD->getRow("SELECT gps_lat AS latitude, gps_long AS longitude, libbu, id
                          FROM politico_bu WHERE codebu LIKE '%".$id."%'");
}

echo json_encode($queries);
?>