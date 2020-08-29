<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('../outil_bi/bi_function_a.php');
//require_once ('../outil_bi/bi_function_b.php');

$BDDMaster = $GLOBALS['EC']['DB']['MASTER'];


//ajout d'un zoom en BDD
$queryFR = $BDDMaster->getall("SELECT coderegion, libregion, latitude, longitude, zoom
                                FROM agence_region
                                WHERE coderegion = 2 OR coderegion = 3 OR coderegion = 4
                                OR coderegion = 6 OR coderegion = 13 OR coderegion = 17
                                OR coderegion = 18 OR coderegion = 19 OR coderegion = 20
                                OR coderegion = 21");
$arrayRegions = array();
foreach($queryFR as $row){
    $arrayRegions[]=$row;
}
echo json_encode($arrayRegions);
?>