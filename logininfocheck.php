<?php
    $db_server = 'localhost';
    $db_user = 'root';
    $db_pass = "";
    $db_name = "campusconnectusersdb";
    $conn = "";
    try{
        $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name);
        }

        catch(Exception $e){
            echo "<script>alert('connection failed');</script>";
        }
        if($conn){
            if($_SERVER['REQUEST_METHOD'] == 'POST'){

                $email = $_POST['lemail'];
                $password = $_POST['lpassword'];
                $sql = "SELECT password FROM userdata WHERE email='$email'";
                $result = mysqli_query($conn, $sql);

                if (mysqli_num_rows($result) === 1) {
                    $row = mysqli_fetch_assoc($result);
                    $hashedPassword = $row['password'];
                    setcookie("email", $email);
                    echo $hashedPassword;
                    

                    if (password_verify($password, $hashedPassword)) {
                        echo "Login success";
                    } else {
                        echo "Wrong password";
                    }
                } else {
                    echo "User not found";
                }

                }
            
            }
    
?>