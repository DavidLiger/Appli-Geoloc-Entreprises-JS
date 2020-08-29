<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];
$id = $_POST["Region_id"];
$query = $BDD->getall("SELECT id, lib_agence_ope FROM politico_bu WHERE coderegion =".$id);

if(!empty($id)) {
    echo '<option>Choisissez une BU</option>';
    foreach($query as $row){
        echo '<option value="'.$row['id'].'" ">'.$row['lib_agence_ope'].'</option>';
    }
}
?>


