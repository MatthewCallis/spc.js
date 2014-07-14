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
// )
$games = parseRSN();
foreach($games as $game){
  $query  = "SELECT * FROM `superfamicom_roms` WHERE `known_titles` LIKE '%" . addslashes($game[2]) . "%' GROUP BY `superfamicom_game_id`;";
  $result = mysql_query($query);
  if($result && mysql_num_rows($result) === 1){
    $query  = "SELECT * FROM `superfamicom_roms` WHERE `known_titles` LIKE '%" . addslashes($game[2]) . "%';";
    $result = mysql_query($query);
    if($result){
      while($db_entry = mysql_fetch_assoc($result)){
        // Add Sources
        $titles_json_string = stripslashes($db_entry['known_titles']);
        $titles_array = json_decode($titles_json_string);
        if(strstr($titles_json_string, $game[0]) === false){
          $titles_array[] = array(
            'source'   => 'SNESMusic.org',
            'filename' => $game[2]
          );
          $titles_array[] = array(
            'source'   => 'SNESMusic.org (RSN Filename)',
            'filename' => $game[1]
          );
        }
        $titles = json_encode($titles_array);
        $titles = str_replace("'", "\'", $titles);

        // Update ROM Info
        $output  = "UPDATE `superfamicom_roms` SET ";
        $output .= "`known_titles` = '" . $titles . "' ";
        $output .= "WHERE `id` = '" . $db_entry['id'] . "';";

        echo $output . "\n";
      }
    }
  }
  else if(mysql_num_rows($result) > 1){
    // Too many matches.
    echo "TOO MANY MATCHES FOR " . $game[2] . "\n";
  }
  else{
    // Game Not Found.
    echo "NOT FOUND " . $game[2] . "\n";
  }
  // Clean Up
  if($result){
    mysql_free_result($result);
  }
}
