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

	def findHistoricData

		historicData = TestSourceSampleData.find_by_sql("SELECT dateTimeTaken, reading, parameterType
														FROM TestSourceSampleData 
														INNER JOIN TestSources on
														TestSourceSampleData.testSource_id = TestSources.id
														inner join Parameters on
														TestSources.parameter_id = Parameters.id
														GROUP BY dateTimeTaken")
		new_array = Array.new

		historicData.each do |x|
		 	new_array << {:dateTimeTaken => x.dateTimeTaken.strftime("%G-%m-%d %OH:%M:%OS")	, :reading => x.reading,:parameterType => x.parameterType}
		end
		#{"dateTimeTaken":"2013-01-01 14:05:14","reading":"0.90000","parameterType":"Flouride"},
		
		json = ActiveSupport::JSON.encode(new_array)

		render :json => json

	end

	def findGetMonth
		#SELECT DISTINCT MONTHNAME(dateTimeTaken) as dateTimeTaken FROM TestSourceSampleData
		months = TestSourceSampleData.all.map{ |d| d.dateTimeTaken.strftime('%B') }.uniq
		#MyModel.all.map { |d| d.my_date_field.strftime('%b %y') }.uniq
		#parameters = find_by_sql("SELECT DISTINCT MONTHNAME(dateTimeTaken) as dateTimeTaken FROM TestSourceSampleData")
		
		#months.each_with_index {|e,i| hash_array[i]["date"] = e}
		new_array = Array.new

		months.each do |x|
		 	new_array << {:dateTimeTaken => x}
		end
		

		json = ActiveSupport::JSON.encode(new_array)

		render :json => json

	end

	def findGetParameter
		#SELECT parameterType FROM Parameters

		parameters = Parameter.select(:parameterType)
		#parameters = find_by_sql("parameterType FROM Parameters")

		json = ActiveSupport::JSON.encode(parameters)

		render :json => json

	end
	def findGetTestSources
		#SELECT parameterType FROM Parameters

		data = TestSourceSampleData.find_by_sql("SELECT testSource_id, inspectionPoint_id, testSourceLocationDescription, 
								dateTimeTaken, dateTimeReceived, reading, parameterType, 
								testSourceLowerLimit, testSourceUpperLimit, 
								testSourceLocationLongtitude, testSourceLocationLatitude 
								FROM TestSourceSampleData AS tssd INNER JOIN TestSources
								ON tssd.testSource_id = TestSources.id
								INNER JOIN Parameters
								ON TestSources.parameter_id = Parameters.id
								WHERE dateTimeTaken = (SELECT Max(dateTimeTaken) FROM TestSourceSampleData
								WHERE testSource_id = tssd.testSource_id)")
		#parameters = find_by_sql("parameterType FROM Parameters")

		json = ActiveSupport::JSON.encode(data)

		render :json => json

	end

	def findGetLiveData
		#SELECT parameterType FROM Parameters

		data = TestSourceSampleData.find_by_sql("SELECT *
												FROM TestSourceSampleData 
												INNER JOIN TestSources on
												TestSourceSampleData.testSource_id = TestSources.id
												inner join Parameters on
												TestSources.parameter_id = Parameters.id  
												where DATE(dateTimeTaken) = CURDATE()
												AND dateTimeTaken >= DATE_SUB(NOW(), interval 10 minute) 
												GROUP BY dateTimeTaken")
		#parameters = find_by_sql("parameterType FROM Parameters")

		json = ActiveSupport::JSON.encode(data)

		render :json => json

	end

	
end
