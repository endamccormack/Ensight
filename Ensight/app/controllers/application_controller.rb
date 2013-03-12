class ApplicationController < ActionController::Base
  protect_from_forgery


  def attempt_login
    authorized_client = Client.authenticate(params[:username], params[:password]) 

    if authorized_client
      session[:id] = authorized_client.id

      if(authorized_client.isAdmin == 'true')
        session[:isAdmin] = true
      end

      session[:clientname] = authorized_client.clientName
      redirect_to(:controller => 'index', :action => 'index')
    else
      flash[:notice] = "Sorry but your login details did not result in a sucessful login, please try again"
      redirect_to(:action => 'index')
    end

  end

  def logout
    session[:id] = nil;
    session[:clientname] = nil;
    session[:isAdmin] = nil;
    flash[:notice] = "You have been sucessfully logged out."
      redirect_to(:action => 'index')
  end

  def getClientWhere(theQuery, theClientId)
    #clientSiteID
    if(theClientId != nil) 
      return theQuery.where(['Clients.id = ?', theClientId])
    else 
      #return " WHERE Clients.id = " + theClientId + " "
      return theQuery
    end
  end

  def getClientSiteWhere(theQuery, theClientSiteId)
    #clientSiteID
    if(theClientSiteId != nil) 
      return theQuery.where(['ClientSites.id = ?', theClientSiteId])
    else 
      #return "AND ClientSites.id = " + theClientSiteId + " "
      return theQuery
    end
  end

  def getInspectionPointWhere(theQuery, theInspectionPointID)
    #clientSiteID
    if(theInspectionPointID != nil) 
      return theQuery.where(['InspectionPoints.id = ?', theInspectionPointID])
    else 
      #return "AND InspectionPoints.id = " + theInspectionPointID + " "
      return theQuery
    end
  end

  def getTestSourceWhere(theQuery, theTestSource)
    if(theTestSource != nil) 
      return theQuery.where(['TestSources.id = ?', theTestSource])
    else 
      return theQuery
      #return "AND TestSources.id = " + theTestSource + " "
    end
  end

  def getTestSourceSampleDataWhere(theQuery, theTestSourceSampleData)
    #clientSiteID
    if(theTestSourceSampleData != nil) 
      return theQuery.where(['TestSourceSampleData.id = ?', theTestSourceSampleData])
      #return "AND TestSourceSampleData.id = " + theTestSourceSampleData + " "
    else 
      return theQuery
    end
  end

  def getParameterWhere(theQuery, theParameter)
    #clientSiteID
    if(theParameter != nil) 
      return theQuery.where(['Parameters.id = ?', theParameter])
      #return "AND Parameters.id = " + theParameter + " "
    else
      return theQuery
    end
  end

  def getTestSourceWithParameterIdWhere(theQuery, theParameter)
    #clientSiteID
    if(theParameter != nil) 
      return  theQuery.where(['TestSources.parameter_id = ?', theParameter])
      #{}"AND TestSources.parameter_id = " + theParameter + " "
    else
      return theQuery
    end
  end

  def getTimeRecievedWhereDates(theQuery, dateStart, dateEnd)
    if(dateStart != nil) 
      theQuery = theQuery.where(['TestSourceSampleData.dateTimeReceived >= ?', dateStart])
      #dateQuery = "AND TestSourceSampleData.dateTimeReceived >= '" + dateStart + "' "
    end

    if(dateEnd != nil) 
      theQuery = theQuery.where(['TestSourceSampleData.dateTimeReceived <= ?', dateEnd])
      #dateQuery += "AND TestSourceSampleData.dateTimeReceived <= '" + dateEnd + "' "
    end

    return theQuery
  end

  def getTimeTakenWhereDates(theQuery, dateStart, dateEnd)
    if(dateStart != nil) 
      theQuery = theQuery.where(['TestSourceSampleData.dateTimeTaken >= ?', dateStart])
      #dateQuery = "AND TestSourceSampleData.dateTimeTaken >= '" + dateStart + "' "
    end

    if(dateEnd != nil) 
      theQuery = theQuery.where(['TestSourceSampleData.dateTimeTaken <= ?', dateEnd])
      #dateQuery += "AND TestSourceSampleData.dateTimeTaken <= '" + dateEnd + "' "
    end

    return theQuery

  end

  protected
  def confirm_logged_in
    unless session[:id]
      flash[:notice] = 'Please log in.'
      redirect_to(:controller => 'index', :action => 'index')
      return false
    else
      return true
    end
  end


end
