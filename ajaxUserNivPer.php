<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('../outil_bi/bi_function_a.php');

global $a;
$connecte=$a->getAuthData('iduser');
$iduser= remplacant();

$BDDMaster = $GLOBALS['EC']['DB']['MASTER'];

$src = $BDDMaster->getrow("select perimetre_ch as chp,perimetre as per from user_droit where theme=31 and iduser=".$connecte);
//debug($src);
$nivUser = "bu";
if($src['chp']=="1"){$nivUser="dirNat";}
if($src['chp']=="region"){$nivUser="dirReg";}

$perUser = array();
$perUser = explode("%",$src['per']);

$construct = $nivUser;
foreach($perUser as $BU){
    $construct .= "|".$BU;
}
echo $construct;
?>