# app.rb

include Mongo

configure do
  conn = MongoClient.new("localhost", 27017)
  set :mongo_connection, conn
  set :mongo_db, conn.db('ServiceNowNotifications')
end

# Return this to service
endpoint = ""

username = ENV["SN_UPDATE_USER"]
password = ENV["SN_UPDATE_PASSWORD"]

db = settings.mongo_db['ServiceNowNotifications']

get '/snurl' do
  endpoint.to_json
end

get '/newTickets/:userid' do
  # Need to sanitize my input here
  
  {:incident => "incident_list",:task => "sc_task_list"}.each do |table,list|  
      url = 
      "https://#{username}:#{password}@#{endpoint}/" \
      "#{list}.do?" \
      "sysparm_query=assigned_to.user_name=#{params[:userid]}" \
      "^" \
      "sys_updated_onBETWEEN#{Chronic.parse('4 hours ago').utc.strftime("%Y-%m-%d %H:00:00")}" \
      "@" \
      "#{Chronic.parse('0 hours ago').utc.strftime("%Y-%m-%d %H:%M:%S")}" \
      "&" \
      "JSON" \
      "&sysparm_view=ess" \
    
    response = RestClient.get URI::encode(url),
    {:accept => 'application/json', :content_type => 'application/json'}
    
    JSON.parse(response)['records'].each do |r|
      # If there's a record there for userid and 
      db.update({:userid => params["userid"],:sys_id => r["sys_id"]}, {"$set" => {:number => r["number"],:type => table}}, { :upsert => true })
    end
  end
  
  #For each that's not checked append respond  
  response = db.find({"userid" => params["userid"],"checked"=>{"$exists" => false}}).collect{|x|x["number"]}

  # Then update all of them to checked
  bulk = db.initialize_ordered_bulk_op
  bulk.find({:userid => params["userid"]}).update({"$set" => {:checked => true}})
  bulk.execute

  # Return the response via json
  response.to_json
end