<?php
    $db_server = 'localhost';
    $db_user = 'root';
    $db_name = 'campusconnectusersdb';
    $db_pass = '';
    $conn = '';

    try{
        $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);

    }catch(Exception $e){
        echo "<script>alert('connection failed');</script>";
    }
    if($conn){
        if($_SERVER["REQUEST_METHOD"]=="POST"){
            $pname = $_POST['pname'];
            $pdes = $_POST['pdescription'];
            $pprice = $_POST['pprice'];
            $pdetails = $_POST['pdetails'];

            
        }
    }
?>