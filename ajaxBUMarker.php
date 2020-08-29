<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$id = $_POST["entreprise_id"];
//$codebu = $BDD->getone("SELECT codebu FROM politicco_corporama WHERE id =".$id);

$queryBU = $BDD->getRow("SELECT gps_lat, gps_long, libbu, id
                          FROM politico_bu WHERE codebu LIKE '%".$id."%'");

//if(!empty($codebu)) {
    $latBU = $queryBU['gps_lat'];
    $longBU = $queryBU['gps_long'];
    $popUpBU = $queryBU['libbu'];
    $idBU = $queryBU['id'];
    echo $latBU."|".$longBU."|".$popUpBU."|".$idBU;
//}
?>


