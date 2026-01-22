<?php
    $db_server = getenv('DB_HOST') ?: 'localhost';
    $db_user = getenv('DB_USER') ?: 'root';
    $db_pass = getenv('DB_PASS') ?: '';
    $db_name = getenv('DB_NAME') ?: 'campusconnectusersdb';
    $db_port = getenv('DB_PORT') ?: 3306;

    $conn = "";
    try {
        $conn = mysqli_connect($db_server, $db_user, $db_pass, $db_name, $db_port);
    } catch(Exception $e) {
        error_log("Connection failed: " . $e->getMessage());
        echo "<script>alert('System error. Please try again later.'); window.location.href='login.php';</script>";
        exit();
    }

    if ($conn) {
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {

            $email = $_POST['lemail'];
            $password = $_POST['lpassword'];

            // Secure SQL lookup
            $sql = "SELECT password FROM userdata WHERE email = ?";
            $stmt = mysqli_prepare($conn, $sql);
            mysqli_stmt_bind_param($stmt, "s", $email);
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);

            if ($row = mysqli_fetch_assoc($result)) {
                $hashedPassword = $row['password'];

                if (password_verify($password, $hashedPassword)) {
                    // Login Success
                    setcookie("email", $email, time() + (86400 * 30), "/");
                    header("Location: index.php");
                    exit();
                } else {
                    echo "<script>alert('Wrong password'); window.location.href='login.php';</script>";
                }
            } else {
                echo "<script>alert('User not found'); window.location.href='login.php';</script>";
            }
            mysqli_stmt_close($stmt);
        }
    }
?>