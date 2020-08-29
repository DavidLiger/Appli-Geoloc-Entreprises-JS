<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$id = $_POST["entreprise_id"];

$queryEntrepriseGps = $BDD->getrow("SELECT latitude, longitude, raison_sociale
                          FROM politicco_corporama WHERE id =".$id);

if(!empty($id)) {
    $latEntreprise = $queryEntrepriseGps['latitude'];
    $longEntreprise = $queryEntrepriseGps['longitude'];
    $popUpEntreprise =  $queryEntrepriseGps['raison_sociale'];
    echo $latEntreprise."|".$longEntreprise."|".$popUpEntreprise;
}
?>


