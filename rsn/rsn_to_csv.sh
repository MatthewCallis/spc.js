OUTPUT="ouput.csv"
touch $OUTPUT
for file in *.rsn; do
  BASE="${file%%.*}"
  echo -n '"' >> $OUTPUT
  echo -n $BASE >> $OUTPUT
  echo -n '"' >> $OUTPUT
  echo -n "," >> $OUTPUT
  echo -n '"' >> $OUTPUT
  echo -n $file >> $OUTPUT
  echo -n '"' >> $OUTPUT
  echo -n "," >> $OUTPUT
  mkdir -p $BASE
  cp $file "$BASE/$file"
  cd $BASE
  unrar x -id[c,d,p,q] $file
  line=$(head -n 1 info.txt)
  cd ..
  rm -fr "$BASE/"
  echo -n '"' >> $OUTPUT
  echo -n $line | tr -d '\r' >> $OUTPUT
  echo -n '"' >> $OUTPUT
  echo "" >> $OUTPUT
done
