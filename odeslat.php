<?php
// Ochrana proti přímému načtení souboru
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Očištění textu od škodlivých znaků
    $myslenka = htmlspecialchars(trim($_POST["myslenka"]), ENT_QUOTES, 'UTF-8');

    // Pokud někdo odeslal prázdný formulář
    if (empty($myslenka)) {
        header("Location: index.html?stav=chyba#kontakt");
        exit;
    }

    // Tvoje doručovací adresa
    $to = "zkbilkova@gmail.com";
    $subject = "Vzkaz v láhvi: Kde mizí svatozář";

    // Jak bude e-mail vypadat
    $message = "Někdo ti zanechal anonymní myšlenku na webu:\n\n";
    $message .= "--------------------------------------------------\n";
    $message .= $myslenka . "\n";
    $message .= "--------------------------------------------------\n";

    // Hlavičky (Odesílatel musí být z tvé domény kvůli spam filtrům)
    $headers = "From: info@kdemizisvatozar.cz\r\n"; 
    $headers .= "Content-Type: text/plain; charset=utf-8\r\n";

    // Odeslání
    if (mail($to, $subject, $message, $headers)) {
        // Úspěch - přesměrování zpět na web
        header("Location: index.html?stav=odeslano#kontakt");
    } else {
        // Chyba serveru Webglobe
        header("Location: index.html?stav=chyba_serveru#kontakt");
    }
    exit;
} else {
    // Přesměrování, pokud se sem někdo dostane omylem
    header("Location: index.html");
    exit;
}
?>