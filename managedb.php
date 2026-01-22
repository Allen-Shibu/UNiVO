<?php
    $db_server = getenv('DB_HOST') ?: 'localhost';
    $db_user = getenv('DB_USER') ?: 'root';
    $db_pass = getenv('DB_PASS') ?: '';
    $db_name = getenv('DB_NAME') ?: 'campusconnectusersdb';
    $db_port = getenv('DB_PORT') ?: 3306;

    $conn = "";
    try {
        $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name, $db_port);
    } catch(mysqli_sql_exception $e) {
        error_log("Connection error: " . $e->getMessage()); 
    }     
        
    if ($conn) {
        if ($_SERVER["REQUEST_METHOD"] == 'POST') {
            
            $name = $_POST['name'];
            $email = $_POST['email'];
            $p = $_POST['password'];
            $rp = $_POST['repassword'];
            
            if (strpos($email, "gectr.ac.in") !== false) {
                
                if ($rp == $p) {
                    $password = password_hash($p, PASSWORD_DEFAULT);

                    $sql = "INSERT INTO userdata (name, email, password) VALUES (?, ?, ?)";
                    $stmt = mysqli_prepare($conn, $sql);
                    mysqli_stmt_bind_param($stmt, "sss", $name, $email, $password);

                    if (mysqli_stmt_execute($stmt)) {
                        setcookie("email", $email, time() + (86400 * 30), "/");
                        header("Location: index.php"); 
                        exit();
                    } else {
                        echo "<script>alert('Error registering user.');</script>";
                    }
                    mysqli_stmt_close($stmt);

                } else {
                    echo "<script>alert('Password confirmation failed');</script>";
                }
            } else {
                echo "<script>alert('You must use your student mail (gectr.ac.in)');</script>";
            }    
        }
    }
?>