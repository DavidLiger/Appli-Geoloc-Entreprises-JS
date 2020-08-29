<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$id = $_POST["BUs_id"];
$query = $BDD->getrow("SELECT gps_lat as latitude, gps_long as longitude, lib_agence_ope as agence FROM politico_bu WHERE id =".$id);

if(!empty($id)) {
    $lat = $query['latitude'];
    $long = $query['longitude'];
    $popup = $query['agence'];
    echo $lat.",".$long.",".$popup;
}
?>


