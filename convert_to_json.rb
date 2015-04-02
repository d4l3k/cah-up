require 'pg'
require 'pry'
require 'json'

p = PG.connect(dbname: 'cah')

#cards = p.exec('select * from white_cards').to_a

final = {}

sets = p.exec('select id, name from card_set where active=true').to_a

sets.sort!{|a, b| a["id"].to_i <=> b["id"].to_i}

sets.each do |set|
  id = set["id"]
  name = set["name"]
  cards = p.exec_params('select text from card_set_white_card, white_cards where card_set_id=$1 AND white_card_id=id', [id]).to_a.map(&:values).map(&:first)
  final[name] = cards
end

File.write('www/js/cards.js', 'window.cards = ' + JSON.dump(final))
