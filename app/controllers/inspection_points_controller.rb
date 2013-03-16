class InspectionPointsController < ApplicationController
	before_filter :confirm_logged_in
	def list

		@inspectionPoints = InspectionPoint.joins('INNER JOIN ClientSites ON InspectionPoints.clientSite_id = ClientSites.id')

		if !session[:isAdmin] == true
			@inspectionPoints = @inspectionPoints.where(['ClientSites.client_id = ?', session[:id]])
		end

		if(params[:clientSite_id] != '' && params[:clientSite_id] != nil)
			params[:theClientSite_id] = params[:clientSite_id]
			@inspectionPoints = @inspectionPoints.where(['ClientSites.id = ?', params[:clientSite_id]])
		end
	end

	def show
		@inspectionPoint = InspectionPoint.find(params[:id])
	end

	def new
		if @inspectionPoint == nil
			@inspectionPoint = InspectionPoint.new
		end
	end

	def create
		@inspectionPoint = InspectionPoint.new

		@inspectionPoint.inspectionPointDescription = params[:inspectionPoint][:inspectionPointDescription]
		@inspectionPoint.inspectionPointLocationLatitude = params[:inspectionPoint][:inspectionPointLocationLatitude]
		@inspectionPoint.inspectionPointLocationLongtitude = params[:inspectionPoint][:inspectionPointLocationLongtitude]
		@inspectionPoint.clientSite_id = params[:clientSite_id]

		if !@inspectionPoint.valid?
			render('new')
		else
			if @inspectionPoint.save
				redirect_to(:action => 'show', :id => @inspectionPoint.id)
			else
				render('new')
				#redirect_to(:action => 'edit')
			end
		end
	end

	def edit
		@inspectionPoint = InspectionPoint.find(params[:id])

	end

	def update
		@inspectionPoint = InspectionPoint.find(params[:id])

		@inspectionPoint.inspectionPointDescription = params[:inspectionPoint][:inspectionPointDescription]
		@inspectionPoint.inspectionPointLocationLatitude = params[:inspectionPoint][:inspectionPointLocationLatitude]
		@inspectionPoint.inspectionPointLocationLongtitude = params[:inspectionPoint][:inspectionPointLocationLongtitude]
		@inspectionPoint.clientSite_id = params[:clientSite_id]

		if !@inspectionPoint.valid?
			render('edit')
		else
			if @inspectionPoint.save
				redirect_to(:action => 'show', :id => @inspectionPoint.id)
			else
				render('edit')
				#redirect_to(:action => 'edit')
			end
		end
	end

	def delete
		@inspectionPoint = InspectionPoint.find(params[:id])
	end

	def destroy
		@inspectionPoint = InspectionPoint.find(params[:id])
		if @inspectionPoint.destroy
			redirect_to(:action => 'list')
		else
			redirect_to(:action => 'delete')
		end
	end

	def getTheInspectionPoint
		getinspectionPoints= InspectionPoint.joins('INNER JOIN ClientSites ON
											InspectionPoints.clientSite_id = ClientSites.id
											INNER JOIN Clients ON
											ClientSites.client_id = Clients.id')
		getinspectionPoints = getinspectionPoints.where('ClientSites.client_id = ?', session[:id])

		return getinspectionPoints
	end

end
