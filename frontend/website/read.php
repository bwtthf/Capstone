<?php

    $servername = 'ec2-13-59-42-62.us-east-2.compute.amazonaws.com';
    $username = 'root';
    $password = 'Capstone2!';
    $dbName =  'spotify';

    $conn = new mysqli($servername,$username,$password,$dbName);

    //if ($_SERVER[])

    if($conn->connect_error)
    {
        die('Connection failed' . $conn->connect_error);
    }
    
    $conn->close();

?>