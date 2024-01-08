/*******************************************************************************************************
	E-Script Intergration Script
	
	Description: 	This script is designed to integrate Nixxis Contact Suite 2.4.x/3.x with Seeasoftware's E-Script script editor
	Dependencies: 	NixxisClientScript.js
	Author: 		Nixxis Indian Ocean
	Version: 		v2.4f
	Last Update: 	2023-03-29

	
******************************************************************************************************
	
	Functions:
		NixxisScript.Voice.NewVoiceCall(destination, hasOriginator, originator)
		NixxisScript.Voice.Hangup(destination)
		NixxisScript.Voice.Hold()
		NixxisScript.Voice.TransferForward(isForward,destination)
		NixxisScript.Voice.Redial(destination)
		NixxisScript.Voice.SendDTMF(DTMF)
		NixxisScript.Voice.StartRecording()
		NixxisScript.Voice.StopRecording()

		NixxisScript.Qualifications.GetQualification(hasActivityId,activityId,allQualification,isPositive,isNeutral,isNegative,isArgued,isCallback)
		NixxisScript.Qualifications.SetQualification(qualification,callbackDate,callbackTime,callbackPhone,isCallback)

		NixxisScript.Common.NixxisInit()
		NixxisScript.Common.CreateRecord(hasActivityId,activityId)
		NixxisScript.Common.SetInternalId()
		NixxisScript.Common.CloseScript()
		NixxisScript.Common.CloseScriptGoReady()
		
	
******************************************************************************************************	
	eScript Variable References: 
		* Get global variable from script -  _Act_Manager.Prepare.getGlobal('Variable Name') ;
		* Modify a script variable, MyVar with MyValue -  _Act_Manager.Prepare.setGlobal('MyVar', 'MyValue'); 
		* Create a new script variable -  _Pr._S.GlbVar['MyNewVar'] = { value: 'MyNewValue', type: 'String' };  // type = String, Array or Object
		* Check if a script variable exists -  if ( _Pr._S.GlbVar['ThisVarExist'] ) // True if exists
		* Notes: To prevent from breaking the script flow use prefix 'NixxisVar_' creating new variables.

******************************************************************************************************/
//For retro compatility
var NixxisDirectLink = true;

var NixxisScript = {

    KEY_PLUGIN: null,
    appURI: "10.0.0.1:8088",
    dataURI: "http://10.0.0.1:8088/data",
    host: "10.0.0.1",

	LastError: null,

	PrintNcsVar: function() {

		return  'Activity : ' + window.external.Activity + '\n' +
	
		'AgentDescription : ' + window.external.AgentDescription + '\n' +
	
		'ContactId : ' + window.external.ContactId + '\n' +
	
		'Context : ' + window.external.Context + '\n' +
	
		'Extension : ' + window.external.Extension + '\n' +
	
		'From : ' + window.external.From + '\n' +
	
		'Media : ' + window.external.Media + '\n' +
	
		'Direction : ' + window.external.GetSessionValue('@Direction') + '\n' +
	
		'PauseDescription : ' + window.external.PauseDescription + '\n' +
	
		'PauseId : ' + window.external.PauseId + '\n' +
	
		'Queue : ' + window.external.Queue + '\n' +
	
		'ScriptParams : ' + window.external.ScriptParams + '\n' +
	
		'State : ' + window.external.State + '\n' +
	
		'StateDescription : ' + window.external.StateDescription + '\n' +
	
		'To : ' + window.external.To + '\n' +
	
		'UserAccount : ' + window.external.UserAccount + '\n' +
	
		'UserName : ' + window.external.UserName + '\n' +
	
		'UUI : ' + window.external.UUI + '\n' +
	
		'WaitForCall : ' + window.external.WaitForCall + '\n' +
	
		'WaitForChat : ' + window.external.WaitForChat + '\n' +
	
		'WaitForMail : ' + window.external.WaitForMail + '\n' +
	
		'ContactListId : ' + window.external.GetSessionValue('@ContactListId') + '\n' +
	
		'CustomerId : ' + window.external.GetSessionValue('@CustomerId') + '\n' +
	
		'RecordingId : ' + window.external.GetSessionValue('@RecordingId') + '\n';
	
	  },

	//VoiceControls
	Voice: {

		/**
		 * 	New Call
		 *	@params	:	string	destination			The phonenumber/destination to call
						bool	hasOriginator		Choice to use custom originator
						string	originator			Number to be used as originator for the call
		 *	@return	:	bool						False for Error			
		**/
		NewVoiceCall: function (destination, hasOriginator, originator) {
			if (destination == '') {
				return false;
			} else if (hasOriginator && originator != '') {
				NixxisContactLink.commands.voicenewcall(destination, originator);
				return true;
			} else {
				NixxisContactLink.commands.voicenewcall(destination);
				return true;
			}

		},


		/**
		 * 	Redial
		 *	@params	:	string	destination			The phonenumber/destination to call
		 *			
		**/
		Redial: /** boolean */ function (destination) {

			try {

				//this will call the m_CInfo.Redial function

				window.external.redial(

					destination,

					window.external.GetSessionValue('@ContactListId'),

					window.external.Activity);



				//window.external.redial(destination);//this does nothing

				return true;

			} catch (e) {

				this.LastError = "Redial : " + e;

				return false;

			}

		},


		/**
		 * 	Hangup
		 *	@params	:	string	destination			The phonenumber/destination to hangup
		 *			
		**/
		Hangup : function() {

			try {
	  
			  window.external.voicehangup();
	  
			} catch(e) {
	  
			  this.LastError = "Hold : " + e;
	  
			}
	  
		  },


		/**
		 * 	Hold
		 *			
		**/
		Hold : function() {

			try {
	  
			  window.external.voicehold();
	  
			} catch(e) { 
	  
			  this.LastError = "Hold : " + e; 
	  
			}
	  
		  },


		/**
		 * 	Transfer or Forward the call
		 *	@params	:	bool	isForward			Choice to use custom originator
						string	destination			The phonenumber/destination to forward the call
		*	@return	:	bool						False for Error			
		**/
		TransferForward : /** boolean */ function(isForward, destination) {

			try {
	  
			  if(!isForward) {
	  
				window.external.voicetransfer();
	  
				return true;
	  
			  }
	  
			  else {
	  
				window.external.voiceforward(destination);
	  
				return true;
	  
			  }				
	  
			} catch(e) {
	  
			  this.LastError = "TransferForward : " + e;
	  
			  return false;
	  
			}
	  
		  },


		/**
		 * 	Send DTMF
		 *	@params	:	string	DTMF			The dtmf number to transmit
		 *			
		**/
		SendDTMF : function(DTMF) {

			try {
	  
			  window.external.executeCommand('~senddtmf', DTMF);
	  
			} catch(e) {
	  
			  this.LastError = "SendDTMF : " + e;
	  
			}
	  
		  },


		/**
		 * 	Start Recording
		 *			
		**/
		StartRecording : function() {

			try {
	  
			  window.external.executeCommand(19, 'True', this.ContactId);
	  
			} catch(e) {
	  
			  this.LastError = "StartRecording : " + e;
	  
			}
	  
		  },


		/**
		 * 	Stop Recording 
		 *			
		**/
		StopRecording : function() {

			try {
	  
			  window.external.executeCommand(19, 'False', this.ContactId);
	  
			} catch(e) {
	  
			  this.LastError = "StopRecording : " + e;
	  
			}
	  
		  }	 

	},

	//Qualifications
	Qualifications : {

		/**
	
		 * Get Qualification
	
		 * @param {boolean} hasActivityId : Choice to provide activityId
	
		 *     for the list of qualifications or load qualifications for 
	
		 *     the current activity -> this parameter should be removed.
	
		 * @param {string} activityId : The GUID of the activity
	
		 *     for the list of qualifications
	
		 * @param {boolean} allQualification : Display all qualifications
	
		 * @param {boolean} isPositive : Display positive qualifications
	
		 * @param {boolean} isNeutral : Display Neutral qualifications
	
		 * @param {boolean} isNegative : Display Negative qualifications
	
		 * @param {boolean} isArgued : Display Argued qualifications
	
		 * @param {boolean} isCallback : Display Callback qualifications
	
		 * @return {string} : Qualifications list formatted in Json with fields :
	
		 *   QualificationId
	
		 *   Description
	
		 *   Action (enum string)
	
		 *   Argued (enum string)
	
		 *   Value
	
		 */
	
		GetQualification : function (
	
			hasActivityId,
	
			activityId,
	
			allQualification,
	
			isPositive,
	
			isNeutral,
	
			isNegative,
	
			isArgued,
	
			/** we are missing includeNotArgued param here */
	
			isCallback) {
	
		  /**
	
		   * window.external.GetQualifications(
	
		   *    bool includePositive,
	
		   *    bool includeNegative,
	
		   *    bool includeNeutral,
	
		   *    bool includeArgued,
	
		   *    bool includeNotArgued)
	
		   * returns a string containing the list of qualifications
	
		   * (without the nodes) in the form :
	
		   * GUID;Description;Action;Argued;Value;0
	
		   * Where :
	
		   * GUID = id of the qualification 
	
		   * Description = Description
	
		   * Action = see EnumQualificationActions:
	
		   *  Id	Description
	
		   *  0 None
	
		   *  1 Do not retry
	
		   *  2 Retry at
	
		   *  3 Retry not before
	
		   *  4 Callback
	
		   *  5 Targeted callback
	
		   *  6 Activity change
	
		   *  7 Black list
	
		   * Argued : boolean
	
		   * Value :
	
		   *  1 Positive
	
		   *  0 Neutral
	
		   *  -1 Negative
	
		   * 0 : end line delimiter
	
		   *
	
		   * This one returns the nodes and qualifs ... not used here.	
	
		   * window.external.executeCommand(
	
		   *    '~getinfo',
	
		   *    1,
	
		   *    "ef7e3357b7a44240a9538b670cd30598");
	
		   */
	
	
	
		  /**
	
		   * Types of Action.
	
		   * @enum {integer}
	
		   */
	
		  const Actions = {
	
			0: 'None',
	
			1: 'Do not retry',
	
			2: 'Retry at',
	
			3: 'Retry not before',
	
			4: 'Callback',
	
			5: 'Targeted callback',
	
			6: 'Activity change',
	
			7: 'Black list'
	
		  };
	
	
	
		  /**
	
		   * Types of Argued.
	
		   * @enum {string}
	
		   */
		  
		  // v2.2f - Correction : 	Values are bypassed because if custom value is used text is not displayed
		  // 						Int will be displayed instead
		  /*
		  const Values = {
	
			'-1': 'Negative',
	
			'0': 'Neutral',
	
			'1': 'Positive'
	
		  };
		  */
	
	
	
		  try {
	
			let includePositive = includeNegative = includeNeutral =
	
				includeArgued = includeNotArgued = false;
	
	
			// v2.2f - Correction 	: Added includeArgued if isPositive, isNeutral, isNegative

			// v2.2f - Known issues :
			// 							isArgued must not be used
			// 							isCallback is to be used alone

			if (isPositive) includePositive = includeArgued = true;
	
			if (isNeutral) includeNeutral = includeArgued = true;
	
			if (isNegative) includeNegative = includeArgued = true;
	
			if (isArgued) includeArgued = true;
	
			if (allQualification) {
	
			  includePositive = includeNegative = includeNeutral =
	
				  includeArgued = includeNotArgued = true;
	
			}
	
			// We don't have an input parameter for this ...
	
			// We take everything and it will be filtered in the end.
	
			if (!allQualification && isCallback) {
	
			  includePositive = includeNegative = includeNeutral =
	
				  includeArgued = includeNotArgued = true;
	
			}
	
	
	
			let s = '';
	
			s = window.external.GetQualifications(
	
				includePositive,
	
				includeNegative,
	
				includeNeutral,
	
				includeArgued,
	
				true);
	
	
	
			//s = window.external.GetQualifications(true,false,false,false,true);
	
			if(s == "") {
	
			  return "No Qualifications";
	
			}
	
			else {
	
			  //return s;
	
			  let quals = [];
	
			  let temp = s.split(';');
	
			  let n = 0;
	
			  if (temp.length > 0) {
	
				n = (temp.length-1) / 6; //-1 :last item is the end delimiter ;0
				
				// v2.2f - Correction : When n > 5 the last qualification was not visible
				if(n > 5){
					n = n + 1;
				};
	
				for (let i=0; i<=n ;i++) {
	
				  let j=i*5;
	
				  if (i==0) {
	
					quals[i] = { 
	
					  'QualificationId': temp[j],
	
					  'Description': unescape(temp[j+1]),
	
					  'Action': Actions[temp[j+2]],
	
					  'Argued': temp[j+3],
					  // v2.2f - Correction : Was 'Value': Values[temp[j+4]]
					  'Value': temp[j+4]
	
					};
	
				  }
	
				  else {
	
					//There is a carriage return somehow right after the ;0 end
	
					//delimiter -> replace.substring on the QualificationId
	
					quals[i] = {
	
					  'QualificationId': temp[j].replace(/[\n\r]+/g, '')
	
						  .substr(1, temp[j].length),
	
					  'Description': unescape(temp[j+1]),
	
					  'Action': Actions[temp[j+2]],
	
					  'Argued': temp[j+3],

					  // v2.2f - Correction : Was 'Value': Values[temp[j+4]]
					  'Value': temp[j+4]
	
					};
	
				  }
	
				}
	
			  }
	
	
	
			  //Filtering for isCallback option					
	
			  if (allQualification) {
	
				return quals;
	
			  }
	
			  else {
	
				if (isCallback) {
	
				  let filteredQuals = [];
	
				  for (let i=0; i < quals.length ; i++) {
	
					if (quals[i].Action == Actions["4"] || quals[i].Action == Actions["5"]) {
	
					  filteredQuals.push(quals[i]);
	
					}
	
				  }
	
				  return filteredQuals;
	
				}
	
				else {
	
				  let filteredQuals = [];
	
				  for (let i=0; i < quals.length ; i++) {
	
					if (quals[i].Action != Actions["4"] || quals[i].Action != Actions["5"]) {
	
					  filteredQuals.push(quals[i]);
	
					}
	
				  }
	
				  return filteredQuals;
	
				}
	
			  }
	
			}
	
		  }	catch(e) {
	
			this.LastError = "GetQualification : " + e;
	
		  }
	
		},
	
	
	
		/**
	
		 * Set Qualification
	
		 * @param {string} qualificationId : The GUID or the short code or
	
		 *    the custom value of the qualification.
	
		 * @param {string} callbackDate : The date output from a calendar object.
	
		 * @param {string} callbackTime : The time output from a time object.
	
		 * @param {string} callbackPhone : The phonenumber / 
	
		 *    destination of the record.
	
		 * @param {boolean} isCallback : Determines if the qualification is a 
	
		 *    normal qualification or a callback.
	
		 * @return {boolean} : True for qualification executed and False for Error.
	
		 */
	
		SetQualification : function (
	
			qualification,
	
			callbackDate,
	
			callbackTime,
	
			callbackPhone,
	
			isCallback) 
			
			{

				if (callbackPhone == '' || typeof (callbackPhone) == 'undefined' || callbackPhone == 'undefined') {

					try 
					
					{

						const direction = window.external.GetSessionValue('@Direction');

						if (direction == 'I') 
						
						{

							callbackPhone = window.external.From;

						}

						else 
						
						{

							callbackPhone = window.external.To;

						}

					} 
					
					catch (e) 
					
					{

						this.LastError = "SetQualification : " + e;

						return false;

					}

				};


				if ( qualification == "" || isCallback == true && (callbackDate == "" || callbackTime == "" ) ) 
				{

					alert('qualificationId : ' + qualification + '\n' +
					'isCallback : ' + isCallback + '\n' +
					'callbackDate : ' + callbackDate + '\n' +
					'callbackTime : ' + callbackTime + '\n' +
					'callbackPhone : ' + callbackPhone + '\n');

					return false;
			
				};


				if (isCallback == true)
				
				{

					let DateCallback = callbackDate;
	
					let TimeCallback = callbackTime;
	
					let yyyy,MM,dd,HH,mm,DateTime;


					if (DateCallback == '' || TimeCallback == '') {

						alert('qualificationId : ' + qualification + '\n' +
								'isCallback : ' + isCallback + '\n' +
								'callbackDate : ' + callbackDate + '\n' +
								'callbackTime : ' + callbackTime + '\n' +
								'callbackPhone : ' + callbackPhone + '\n'
							);
	
						return false;
			  
					}

					else
					
					{
			  
						//Get DateTime Info
			  
						DateCallback = new Date(DateCallback);
			  
						yyyy = DateCallback.getFullYear();
			  
						MM = DateCallback.getMonth()+1;
			  
						dd = DateCallback.getDate();
			  
						TimeCallback = TimeCallback.split(':');
			  
						HH = TimeCallback[0];
			  
						mm = TimeCallback[1];
			  
			  
						//Convert to string
			  
						yyyy = yyyy.toString();
			  
						MM = MM.toString();
			  
						dd = dd.toString();
			  
						HH = HH.toString();
			  
						mm = mm.toString();

						//checking length
			  
						if (dd.length == '1') dd = '0' + dd;
			  
						if (MM.length == '1') {
			  
						  MM = '0' + MM;
			  
						}

						DateTime = yyyy + MM + dd + HH + mm;

						window.external.SetQualification(qualification, DateTime, callbackPhone );

					}

				}

				else

				{
					
					window.external.SetQualification(qualification, "", callbackPhone);

				};
 
		  return true;
	
		}
	
	  },



	//General Commands
	Common: {

		/**
		 * 	Nixxis Init - Initialises NixxisContactLink and basic information, Determines if there is a record linked to the contact.
		 *	@return	:	bool	True for KEY_PLUGIN/ContactListId found and False for KEY_PLUGIN/ContactListId not found 	
		**/
		NixxisInit: function () {

			NixxisScript.KEY_PLUGIN = _Act_Manager.Prepare.getGlobal('KEY_PLUGIN');
			/*NixxisScript.dataURI = _Act_Manager.Prepare.getGlobal('NixxisDataURI');
			NixxisScript.appURI = _Act_Manager.Prepare.getGlobal('NixxisApp');
			NixxisScript.host = _Act_Manager.Prepare.getGlobal('NixxisHost');*/


			NixxisContactLink.Init();

			try {
			var AgentName = NixxisContactLink.agent.UserAccount();
			_Pr._S.GlbVar['NixxisVar_AgentName'] = { value: AgentName, type: 'String' };

			var vActivity = window.external.Activity;
			_Pr._S.GlbVar['NixxisVar_Activity'] = { value: vActivity, type: 'String' };

			var vAgentDescription = window.external.AgentDescription;
			_Pr._S.GlbVar['NixxisVar_AgentDescription'] = { value: vAgentDescription, type: 'String' };

			var vContactId = window.external.ContactId;
			_Pr._S.GlbVar['NixxisVar_ContactId'] = { value: vContactId, type: 'String' };

			var vContext = window.external.Context;
			_Pr._S.GlbVar['NixxisVar_Context'] = { value: vContext, type: 'String' };

			var vExtension = window.external.Extension;
			_Pr._S.GlbVar['NixxisVar_Extension'] = { value: vExtension, type: 'String' };

			var vFrom = window.external.From;
			_Pr._S.GlbVar['NixxisVar_From'] = { value: vFrom, type: 'String' };

			var vMedia = window.external.Media;
			_Pr._S.GlbVar['NixxisVar_Media'] = { value: vMedia, type: 'String' };

			var vDirection = window.external.GetSessionValue('@Direction');
			_Pr._S.GlbVar['NixxisVar_Direction'] = { value: vDirection, type: 'String' };

			var vQueue = window.external.Queue;
			_Pr._S.GlbVar['NixxisVar_Queue'] = { value: vQueue, type: 'String' };

			var vState = window.external.State;
			_Pr._S.GlbVar['NixxisVar_State'] = { value: vState, type: 'String' };

			var vStateDescription = window.external.StateDescription;
			_Pr._S.GlbVar['NixxisVar_StateDescription'] = { value: vStateDescription, type: 'String' };

			var vTo = window.external.To;
			_Pr._S.GlbVar['NixxisVar_To'] = { value: vTo, type: 'String' };

			var vUserAccount = window.external.UserAccount;
			_Pr._S.GlbVar['NixxisVar_UserAccount'] = { value: vUserAccount, type: 'String' };

			var vUserName = window.external.UserName;
			_Pr._S.GlbVar['NixxisVar_UserName'] = { value: vUserName, type: 'String' };

			var vUUI = window.external.GetSessionValue('@UUI');
			_Pr._S.GlbVar['NixxisVar_UUI'] = { value: vUUI, type: 'String' };

			var vContactListId = window.external.GetSessionValue('@ContactListId');
			_Pr._S.GlbVar['NixxisVar_ContactListId'] = { value: vContactListId, type: 'String' };

			var vCustomerId = window.external.GetSessionValue('@CustomerId');
			_Pr._S.GlbVar['NixxisVar_CustomerId'] = { value: vCustomerId, type: 'String' };

			} catch (e) {  }
			

			try {
				if ((NixxisScript.dataURI == '' || typeof (NixxisScript.dataURI) == 'undefined' || NixxisScript.dataURI == 'undefined') && (NixxisScript.host == '' || typeof (NixxisScript.host) == 'undefined' || NixxisScript.host == 'undefined') && (NixxisScript.appURI == '' || typeof (NixxisScript.appURI) == 'undefined' || NixxisScript.appURI == 'undefined')) throw "Missing App Server Address";
			}
			catch (e) { return "Error : " + e; }

			if ((NixxisScript.dataURI == '' || typeof (NixxisScript.dataURI) == 'undefined' || NixxisScript.dataURI == 'undefined') && !(NixxisScript.appURI == '' || typeof (NixxisScript.appURI) == 'undefined' || NixxisScript.appURI == 'undefined')) {
				NixxisScript.dataURI = 'http://' + NixxisScript.appURI + '/data';
			}

			try {
			var ContactListId = window.external.GetSessionValue('@ContactListId');
			}
			catch (e) { var ContactListId = NixxisScript.KEY_PLUGIN; }

			if (((ContactListId == '' || typeof (ContactListId) == 'undefined' || ContactListId == 'undefined') && (NixxisScript.KEY_PLUGIN == '' || typeof (NixxisScript.KEY_PLUGIN) == 'undefined' || NixxisScript.KEY_PLUGIN == 'undefined'))) { return false; }
			else { return true; }

		},


		/**
		 * 	Create New Record
		 *	@params	:	bool	hasActivityId		Choice to provide activityId into which the new record will be created
						Guid	activityId			The GUID of the activity
		 *	@return	:	bool						True for executed properly and False for Error			
		**/
		CreateRecord: function (hasActivityId, activityId) {

			var contactRef, activityId_;

			var baseUri = NixxisScript.dataURI;

			if (!hasActivityId)
			{ 
				activityId_ = window.external.Activity; 
			};

			if (hasActivityId && (activityId != '' || typeof (activityId) != 'undefined' || activityId != 'undefined'))
			{
				activityId_ = activityId;
			};

			if ((activityId_ != '' || typeof (activityId_) != 'undefined' || activityId_ != 'undefined')) 
			{
				var uri = "" + baseUri + "?action=createContextData&activity=" + activityId_ + "";
				//alert(uri);
				$.ajax({
					type: "GET",
					dataType: "xml",
					url: uri
					}).done(function (xml) {
						var toReturn = {};
						toReturn['ref'] = $(xml).find("contextdata").attr('internalId');

						contactRef = toReturn.ref;
						NixxisContactLink.contactlistId = contactRef;
						_Act_Manager.Prepare.setGlobal('KEY_PLUGIN', contactRef);
						NixxisScript.KEY_PLUGIN = contactRef;

					return true;

					}).fail(function (msg) {
						var message = "Error while processing request no records created: " + msg.status + ", " + msg.statusText;
						alert(message);
					return false;
				});

				return true;
			}

			else

			{
				return false;
			}

		},


		/**
		 * 	Set InternalID -  Links the ContactListId to the ContactID
		 *	@return	:	bool						True for executed properly and False for Error			
		**/
		SetInternalId: function () {

			NixxisScript.KEY_PLUGIN = _Act_Manager.Prepare.getGlobal('KEY_PLUGIN');
			var contactRef = NixxisScript.KEY_PLUGIN;

			var baseUri = NixxisScript.dataURI;
			var contactID = window.external.GetSessionValue('@ContactId');

			_Pr._S.GlbVar['NixxisVar_contactID'] = { value: contactID, type: 'String' };

			if( (contactRef=='' || typeof(contactRef)=='undefined' || contactRef=='undefined') && (contactID=='' || typeof(contactID)=='undefined' || contactID=='undefined'))
			{

				alert('KEY_PLUGIN : ' + NixxisScript.KEY_PLUGIN + '\n' + 
				'contactID : ' + window.external.GetSessionValue('@ContactId'));

				return false;

			} 
			
			else 

			{

				//SetInternall Id on nixxis

				var uri = baseUri + "?action=setinternalid&contact=" + contactID + "&id=" + contactRef;

			$.ajax({
				type: "GET",
				dataType: "xml",
				url: uri
			}).done(function (xml) {
				NixxisContactLink.contactlistId = contactRef;
				var message = 'La fiche avec un id: "' + contactRef + '"  a été sélectée, veuillez patienter.';
				return true;

			}).fail(function (msg) {
				var message = "Error while processing request: " + msg.status + ", " + msg.statusText;
				alert(message);
				return false;
			});

			return true;
			};
			
		},


		/**
		 * 	Close Script
		 *			
		**/
		CloseScript: function () {
			NixxisContactLink.commands.terminateContact();
		},


		/**
		 * 	Close Script and Go Ready 
		 *			
		**/
		CloseScriptGoReady: function () {
			NixxisContactLink.commands.terminateContactAndGoReady();
		}

	},



	// Not yet Implemented

	// Agenda
	Agenda: {

		GetAgenda: function (date, time, area) {
			var rawAgendaList = NixxisContactLink.Agenda.getAgendaByContact(dateTime, area);
			//ToDo Parse
			//Return JSON
		},

		StoreAppointment: function (date, time, duration, description, area) {
			//ToDo convert date and time from objects

			NixxisContactLink.Agenda.storeAppointmentByContact(dateTime, duration, description, area);
		},

		CancelAppointment: function (Id, hasId) {
			if (hasId) {
				NixxisContactLink.Agenda.cancelAppointment();
			}
			else {
				NixxisContactLink.Agenda.cancelAppointmentById(id);
			}
		}

	},

	// Predefined Text
	PredefinedText: {
		GetPredefinedText: function () {
			var rawPredefList = NixxisContactLink.commands.getPredefinedTexts();
			//ToDo Parse
			//Return JSON
		},

		AddInsertText: function (isInsert, text) {
			if (isInsert) {
				NixxisContactLink.Email.InsertText(text);
			}
			else {
				NixxisContactLink.Email.AddText(text);
			}
		},

		ClearText: function () {
			NixxisContactLink.Email.ClearText();
		}

	}


};
