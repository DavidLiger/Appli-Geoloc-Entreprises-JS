<?php
require_once ('../fonction/base.php');
require_once 'HTML/QuickForm/Renderer/ITStatic.php';
require_once ('bi_function_a.php');

//date_default_timezone_set('Europe/Paris');

$BDD = $GLOBALS['EC']['DB']['CLIENT'];

$data = json_decode($_POST['dataCtrl']);
$url = $data[0];
$ip = $data[1];
$dt = new DateTime();
$datetime = $dt->format('d-m-Y H:i:s');

if(isset($_POST['dataCtrl'])) {
    $table_name = 'ctrl_vstrs';
    $table_fields = array('url', 'ip', 'datetime');
    $table_values = array($url, $ip, $datetime);

    $sth = $BDD->autoPrepare($table_name, $table_fields,
        DB_AUTOQUERY_INSERT);

    if (PEAR::isError($sth)) {
        die($sth->getMessage());
    }

    $res =& $BDD->execute($sth, $table_values);

    if (PEAR::isError($res)) {

        die($res->getMessage());

    }
}
?>