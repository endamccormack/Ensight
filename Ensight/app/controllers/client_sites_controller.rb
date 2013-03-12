class ClientSitesController < ApplicationController
	before_filter :confirm_logged_in

	def list
		if session[:isAdmin] == true
			@clientSites = ClientSite.all
		else
			@clientSites = Array.new
			getClientSites = ClientSite.where('client_id = ?', session[:id])

			if !getClientSites.empty?
				@clientSites.push(getClientSites)
			end
		end
	end

	def show
		if session[:isAdmin]
			@clientSite = ClientSite.find(params[:id])
		else
			@clientSite = getTheClientSite
			@clientSite = @clientSite.find(params[:id])
		end
	end

	def new
		if @clientSite == nil
			@clientSite = ClientSite.new
		end
	end

	def create
		Rails.logger.warn params[:clientSite]

		@clientSite = ClientSite.new
		@clientSite.clientSiteName = params[:clientSite][:clientSiteName]
		@clientSite.clientSiteAddress = params[:clientSite][:clientSiteAddress]
		@clientSite.clientSiteLocationLatitude = params[:clientSite][:clientSiteLocationLatitude]
		@clientSite.clientSiteLocationLongtitude = params[:clientSite][:clientSiteLocationLongtitude]
		@clientSite.client_id = session[:id]

		if @clientSite.valid? == false
			render('new')
		else
			if @clientSite.save
				redirect_to(:action => 'list')
			else
				render('new')
			end
		end
	end

	def edit
		if @clientSite == nil
			@clientSite = ClientSite.find(params[:id])
		end
	end

	def update
		@clientSite = ClientSite.find(params[:id])

		@clientSite.clientSiteName = params[:clientSite][:clientSiteName]
		@clientSite.clientSiteAddress = params[:clientSite][:clientSiteAddress]
		@clientSite.clientSiteLocationLatitude = params[:clientSite][:clientSiteLocationLatitude]
		@clientSite.clientSiteLocationLongtitude = params[:clientSite][:clientSiteLocationLongtitude]
		if @clientSite.save
			redirect_to(:action => 'show', :id => @clientSite.id)
		else
			render('edit')
			#redirect_to(:action => 'edit', :id => @clientSite.id)
		end
	end

	def delete
		@clientSite = ClientSite.find(params[:id])
	end

	def destroy
		@clientSite = ClientSite.find(params[:id])
		if @clientSite.destroy
			redirect_to(:action => 'list')
		else
			redirect_to(:action => 'delete')
		end
	end

	def getTheClientSite
		getClientSite = ClientSite.where('ClientSites.client_id = ?', session[:id])

		return getClientSite
	end
end
