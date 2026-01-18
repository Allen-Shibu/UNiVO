<?php
include ('managedb.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="styles.css?v=<?php echo time(); ?>">
    <title>Document</title>
</head>
<body>
    <div id="container">
        <!-- ;lkajs,,mkndf -->
        <div class="datas">
            <form id="registerform" method="POST">
                <label id="title">Create Your Account</label>
                <input class="signupinput" name = 'name' type="text" placeholder="Full name"><br>
                <input class="signupinput" name = 'email' type="text" placeholder="email address"><br>
                <input class="signupinput" name = 'password' type="password" placeholder="password"><br>
                <input class="signupinput" name = 'repassword' type="password" placeholder="confirm password"><br>
                <br><br>
                <button type="submit" class="registerbtn"> Sign up</button><br><br>
                <Label id="haveanaccount">i have an account</label>
                <a href="login.php" id="loginredirectbutton">Login</a>
            </form>
        </div>
        
    </div>
</body>
</html>