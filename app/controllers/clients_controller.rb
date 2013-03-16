class ClientsController < ApplicationController
	before_filter :confirm_logged_in	
	def list
		if session[:isAdmin] == true
			@client =Client.all
		else
			@client = Array.new
			@client.push(Client.find(session[:id]))
		end
	end

	def show
		@client = Client.find(params[:id])
	end

	def new

		if @client == nil
			@client = Client.new
		end
	end

	def create
		@client = Client.new
		@client.clientName = params[:clientName]
		salt = Client.make_salt(@client.clientName)
		@client.salt = salt
		@client.clientAddress = params[:clientAddress]
		@client.clientPassword = Client.hash(params[:password], salt)

		if session[:isAdmin] == true
			@client.isAdmin = params[:isAdmin]
		else
			@client.isAdmin = false
		end
		
		if @client.valid? == false
			render('new')
		else
			if @client.save
				redirect_to(:action => 'list')
			else
				render('new')
			end
		end
	end

	def edit
		@client = Client.find(params[:id])
		params[:clientName] = @client.clientName
		params[:clientAddress] = @client.clientAddress
	end

	def update
		puts "I started"
		flash[:notice] = "meh"
		@client = Client.find(params[:id])

		puts @client
		authorized_client = Client.authenticate(@client.clientName, params[:oldPassword]) 

		salt = Client.make_salt(@client.clientName)

		@client.clientName = params[:clientName]
		@client.clientAddress = params[:clientAddress]
		@client.salt = salt
		@client.clientPassword = params[:password]

		if(!@client.valid?)
			render('edit')
		else
			@client.clientPassword = Client.hash(params[:password], salt)
			if authorized_client
				if @client.save
					redirect_to(:action => 'show', :id => @client.id)
				else
					flash[:notice] = "didnt update"
					redirect_to(:action => 'edit', :id => @client.id)
				end
			else
			  render(:action => 'edit')
			end
		end
		
	end

	def delete
		@client = Client.find(params[:id])
		params[:clientName] = @client.clientName
		params[:clientAddress] = @client.clientAddress
	end

	def destroy
		@client = Client.find(params[:id])
		if @client.destroy
			redirect_to(:action => 'list')
		else
			redirect_to(:action => 'delete')
		end
	end


end
