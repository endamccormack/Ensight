require 'uri'
require 'cgi'

class JsonRequestController < ApplicationController

	before_filter :confirm_logged_in

	def index
		#session[:ProcName] = CGI.parse(URI.parse(url).query)[0]

		if session[:clientname] && session[:id].to_s 
			#if we had a clientID param
			findTestSourceSampleData
		else
			return
		end
	end

	def findClient
		#can have ID or ContactID
		clients = Client.find_by_id(session[:id].to_s)
		json = ActiveSupport::JSON.encode(clients)
			
		render :json => json
	end

	def findClientSite
		#can have ID ContactID or ClientID
		clientSites = ClientSite.joins("INNER JOIN Clients ON ClientSites.client_id = Clients.id")
		clientSites	= getClientWhere(clientSites, session[:id].to_s)
		clientSites	= getClientSiteWhere(clientSites, params[:ClientSiteID])

		json = ActiveSupport::JSON.encode(clientSites)
			
		render :json => json
		
	end

	def findInspectionPoint
		#can have ID or ClientSiteID
		inspectionPoints = InspectionPoint.joins("INNER JOIN ClientSites ON
											InspectionPoints.clientSite_id = ClientSites.id
											INNER JOIN Clients ON
											ClientSites.client_id = Clients.id")
		inspectionPoints = getClientWhere(inspectionPoints, session[:id].to_s)
		inspectionPoints = getClientSiteWhere(inspectionPoints, params[:ClientSiteID]) 
		inspectionPoints = getInspectionPointWhere(inspectionPoints, params[:InspectionPointID])

		json = ActiveSupport::JSON.encode(inspectionPoints)
			
		render :json => json
		
	end

	def findTestSource
		#can find using ID parameterID or inspectionPointID
		testSources = TestSource.joins("INNER JOIN InspectionPoints ON
											TestSources.inspectionPoint_id = InspectionPoints.id
											INNER JOIN ClientSites ON
											InspectionPoints.clientSite_id = ClientSites.id
											INNER JOIN Clients ON
											ClientSites.client_id = Clients.id")
		testSources = getClientWhere(testSources, session[:id].to_s)
		testSources = getClientSiteWhere(testSources, params[:ClientSiteID])
		testSources = getInspectionPointWhere(testSources, params[:InspectionPointID])
		testSources = getTestSourceWhere(testSources, params[:TestSourceID])

		json = ActiveSupport::JSON.encode(testSources)

		render :json => json
	end

	def findTestSourceSampleData
		#from
		#until

		testSourceSampleData = TestSourceSampleData.joins("INNER JOIN TestSources ON
											TestSourceSampleData.testSource_id = TestSources.id
											INNER JOIN InspectionPoints ON
											TestSources.inspectionPoint_id = InspectionPoints.id
											INNER JOIN ClientSites ON
											InspectionPoints.clientSite_id = ClientSites.id
											INNER JOIN Clients ON
											ClientSites.client_id = Clients.id")
		testSourceSampleData = getClientWhere(testSourceSampleData, session[:id].to_s) 
		testSourceSampleData = getClientSiteWhere(testSourceSampleData, params[:ClientSiteID])
		testSourceSampleData = getInspectionPointWhere(testSourceSampleData, params[:InspectionPointID])
		testSourceSampleData = getTestSourceWhere(testSourceSampleData, params[:TestSourceID]) 
		testSourceSampleData = getTestSourceWithParameterIdWhere(testSourceSampleData, params[:ParameterID]) 
		testSourceSampleData = getTestSourceSampleDataWhere(testSourceSampleData, params[:TestSourceSampleDataID])
		testSourceSampleData = getTimeRecievedWhereDates(testSourceSampleData, params[:TimeRecievedStart], params[:TimeRecievedEnd]) 
		testSourceSampleData = getTimeTakenWhereDates(testSourceSampleData, params[:TimeTakenStart], params[:TimeTakenEnd])
		Rails.logger.warn session[:id].to_s
		Rails.logger.warn testSourceSampleData.to_sql
		Rails.logger.warn testSourceSampleData.inspect
		json = ActiveSupport::JSON.encode(testSourceSampleData)

		render :json => json

	end

	def findParameter

		parameters = Parameter.joins("INNER JOIN TestSources ON
											Parameters.id = TestSources.parameter_id
											INNER JOIN InspectionPoints ON
											TestSources.inspectionPoint_id = InspectionPoints.id
											INNER JOIN ClientSites ON
											InspectionPoints.clientSite_id = ClientSites.id
											INNER JOIN Clients ON
											ClientSites.client_id = Clients.id")

		parameters = getClientWhere(parameters, session[:id].to_s) 
		parameters = getClientSiteWhere(parameters, params[:ClientSiteID]) 
		parameters = getInspectionPointWhere(parameters, params[:InspectionPointID])
		parameters = getTestSourceWhere(parameters, params[:TestSourceID])
		parameters = getParameterWhere(parameters, params[:ParameterID])
		
		json = ActiveSupport::JSON.encode(parameters)

		render :json => json
				
	end

end
