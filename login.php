
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="loginstyles.css?v=<?php echo time(); ?>">
    <title>Document</title>
    <!-- <script src="login.js" defer></script> -->
</head>
<body>
    <div id="logincontainer">
        <!-- ;lkajs,,mkndf -->
        <div class="Logindatas">
            <form id="Loginform" method="POST" action="logininfocheck.php">
                <?php
                include ('logininfocheck.php');
                ?>
                            
                <label id="logintitle">Login</label>
                <input class="signininput" name = 'lemail' type="text" id="lemail" placeholder="email address"><br>
                <input class="signininput" name = 'lpassword' type="password" id='lpass' placeholder="password"><br>
                <br>
                <button type="submit" class="registerbtn" id="loginbtn"> Sign in</button><br>
                <Label id="haveanaccount">i don't have an account</label>
                <a href="login.php" id="loginredirectbutton">register</a>

            </form>
        </div>
        
    </div>
</body>
</html>