<?php
date_default_timezone_set('America/Los_Angeles');
$link = mysql_connect('127.0.0.1', 'root', '');
if(!$link){
  die('Could not connect: ' . mysql_error());
}
mysql_select_db('superfamicom', $link);
# Parse RSN Output
function parseRSN(){
  $rsn_games = array();
  if(($handle = fopen('ouput_complete.csv', 'r')) !== FALSE){
    while(($data = fgetcsv($handle, 1000, ",")) !== FALSE){
      $rsn_games[] = $data;
    }
    fclose($handle);
  }
  return $rsn_games;
}
// Array
// (
//     [0] => Set Slug
//     [1] => Filename
//     [2] => Game Name
//     [3] => Game ID
//     [4] => Game Slug
// )
$games = parseRSN();
$found    = '';
$missing  = '';
$confused = '';
foreach($games as $game){
  $query  = "SELECT * FROM `superfamicom_roms` WHERE `known_titles` LIKE '%" . addslashes($game[2]) . "%' GROUP BY `superfamicom_game_id`;";
  $result = mysql_query($query);
  if($result && mysql_num_rows($result) === 1){
    $query  = "SELECT * FROM `superfamicom_roms` WHERE `known_titles` LIKE '%" . addslashes($game[2]) . "%';";
    $result = mysql_query($query);
    if($result){
      while($db_entry = mysql_fetch_assoc($result)){
        $query  = "SELECT `slug` FROM `superfamicom_games` WHERE `id` LIKE '" . $db_entry['superfamicom_game_id'] . "';";
        $game_result = mysql_query($query);
        $game_entry  = mysql_fetch_assoc($game_result);

        // Output new CSV line
        $found .= '"' . $game[0] . '",';
        $found .= '"' . $game[1] . '",';
        $found .= '"' . $game[2] . '",';
        $found .= '"' . $db_entry['id'] . '",';
        $found .= '"' . $game_entry['slug'] . '"';
        $found .= "\n";
      }
    }
  }
  else if(mysql_num_rows($result) > 1){
    // Too many matches.
    // Output new CSV line
    $confused .= '"' . $game[0] . '",';
    $confused .= '"' . $game[1] . '",';
    $confused .= '"' . $game[2] . '",';
    $confused .= '"",';
    $confused .= '""';
    $confused .= "\n";
  }
  else{
    // Game Not Found.
    // Output new CSV line
    $missing .= '"' . $game[0] . '",';
    $missing .= '"' . $game[1] . '",';
    $missing .= '"' . $game[2] . '",';
    $missing .= '"",';
    $missing .= '""';
    $missing .= "\n";
  }
  // Clean Up
  if($result){
    mysql_free_result($result);
  }
}

file_put_contents('found.csv',    $found);
file_put_contents('missing.csv',  $missing);
file_put_contents('confused.csv', $confused);
