<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$id = $_POST['region_id'];
$queryBU = $BDD->getall("SELECT id, libbu AS libbu, gps_lat AS latitude, gps_long AS longitude, libregion
                      FROM politico_bu WHERE coderegion=".$id);
$arrayBUs = array();
foreach($queryBU as $rowBU){
    $arrayBUs[]=$rowBU;
}
echo json_encode($arrayBUs);
?>
