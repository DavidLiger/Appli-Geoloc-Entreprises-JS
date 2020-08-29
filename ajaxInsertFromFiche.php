<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];

$data = json_decode($_POST['idNomConcat']);
$idEntreprise = $data[0];
$budget = $data[1];
$idresponsable = $data[2];

if(isset($_POST['idNomConcat']) && is_numeric($budget)) {
    //requête préparé pour parer à d'éventuelles injections SQL
    // voir https://pear.php.net/manual/en/package.database.db.db-common.autoprepare.php
    $table_name   = 'politicco_corporama';
    $table_fields = array('budget', 'idresponsable');
    $table_values = array($budget, $idresponsable);

    $sth = $BDD->autoPrepare($table_name, $table_fields,
        DB_AUTOQUERY_UPDATE, "id = $idEntreprise");

    if (PEAR::isError($sth)) {
        die($sth->getMessage());
    }

    $res =& $BDD->execute($sth, $table_values);

    if (PEAR::isError($res)) {
        die($res->getMessage());
    }
}
?>


