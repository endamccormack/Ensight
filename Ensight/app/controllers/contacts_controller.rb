class ContactsController < ApplicationController


	before_filter :confirm_logged_in


	def list
		if session[:isAdmin] == true
			@contacts = Contact.all
		else
			@contacts = Array.new
			getcontacts = Contact.where('ClientSites.client_id = ?', session[:id])

			if !getcontacts.empty?
				@contacts.push(getcontacts)
			end
		end
	end


	def show
		@contact = Contact.find(params[:id])
	end


	def new
		if @contact == nil
			@contact = Contact.new
		end
	end


	def create
		@contact = Contact.new

		@contact.contactName = params[:contact][:contactName]
		@contact.contactEmail = params[:contact][:contactEmail]
		@contact.contactPhone = params[:contact][:contactPhone] 
		@contact.contactPosition = params[:contact][:contactPosition]
		@contact.client_id = params[:contact][:client_id]
		@contact.clientSite_id = params[:contact][:clientSite_id]
		    
		
		if params[:client_id] != ''
			@contact.client_id = params[:client_id]
		else
			@contact.client_id = nil
		end
		if params[:clientSite_id] != ''
			@contact.clientSite_id = params[:clientSite_id]
		else
			@contact.clientSite_id = nil
		end

		if !@contact.valid?
			render('new')
		else
			if @contact.save
				redirect_to(:action => 'list')
			else
				render('new')
			end
		end
	end


	def edit
		if session[:isAdmin]
			@contact = Contact.find(params[:id])
		else
			@contact = getTheContact
			@contact = @contact.find(params[:id])
		end
	end


	def update
		if session[:isAdmin]
			@contact = Contact.find(params[:id])
		else
			@contact = getTheContact
			@contact = @contact.find(params[:id])
		end

		@contact.contactName = params[:contact][:contactName]
		@contact.contactEmail = params[:contact][:contactEmail]
		@contact.contactPhone = params[:contact][:contactPhone] 
		@contact.contactPosition = params[:contact][:contactPosition]
		@contact.client_id = params[:contact][:client_id]
		@contact.clientSite_id = params[:contact][:clientSite_id]

		if params[:client_id] != ''
			@contact.client_id = params[:client_id]
		else
			@contact.client_id = nil
		end
		if params[:clientSite_id] != ''
			@contact.clientSite_id = params[:clientSite_id]
		else
			@contact.clientSite_id = nil
		end

		if !@contact.valid?
			render('edit')
		else
			if @contact.save
				redirect_to(:action => 'show', :id => @contact.id)
			else
				render('edit')
			end
		end
	end


	def delete
		if session[:isAdmin]
			@contact = Contact.find(params[:id])
		else
			@contact = getTheContact
			@contact = @contact.find(params[:id])
		end
	end


	def destroy
		if session[:isAdmin]
			@contact = Contact.find(params[:id])
		else
			@contact = getTheContact
			@contact = @contact.find(params[:id])
		end

		if @contact.destroy
			redirect_to(:action => 'list')
		else
			redirect_to(:action => 'delete')
		end
	end

	
	def getTheContact
		getContact = getinspectionPoints.where('client_id = ?', session[:id])
		return getinspectionPoints
	end
end
