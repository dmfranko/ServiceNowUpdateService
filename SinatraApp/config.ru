#\ -p 4567

require 'bundler'
Bundler.require(:default)

require './app'
run Sinatra::Application