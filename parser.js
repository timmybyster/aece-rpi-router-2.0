/* mysqlParser.js
created by: Tim Buckley
2017/07/24 */

module.exports = {
	
	parseNodeData : function (mysqlData){
		var result = {
			id: mysqlData['id'],
			parent_id: mysqlData['parent_id'],
			serial: parseInt(mysqlData['serial']),
			type_id: mysqlData['type_id'],
			data : null,
			children : []
		};
		switch(result.type_id){
			case 0 :
				result.data = createIbcDataObject(mysqlData);
				break;
			case 1 :
				result.data = createIscDataObject(mysqlData);
				break;
			case 2 :
				result.data = createIb651DataObject(mysqlData);
				break;
			case 3 :
				result.data = createAb1DataObject(mysqlData);
				break;
			case 4 :
				result.data = createEddDataObject(mysqlData);
				break;
		}
		return result;
	}
}

function createIbcDataObject(mysqlData){
	var ibcDataObject = {
			communication_status: mysqlData['communication_status'],
			key_switch_status: mysqlData['key_switch_status'],
			blast_armed: mysqlData['blast_armed'],
			fire_button: mysqlData['fire_button'],
			isolation_relay: mysqlData['isolation_relay'],
			cable_fault: mysqlData['cable_fault'],
			earth_leakage: mysqlData['earth_leakage']
	}
	return ibcDataObject;
}

function createIscDataObject(mysqlData){
	var iscDataObject = {
			communication_status: mysqlData['communication_status'],
			key_switch_status: mysqlData['key_switch_status'],
			blast_armed: mysqlData['blast_armed'],
			isolation_relay: mysqlData['isolation_relay'],
			cable_fault: mysqlData['cable_fault'],
			earth_leakage: mysqlData['earth_leakage']
	}
	return iscDataObject;
}

function createIb651DataObject(mysqlData){
	var ib651DataObject = {
			communication_status: mysqlData['communication_status'],
			window_id: mysqlData['window_id'],
			key_switch_status: mysqlData['key_switch_status'],
			detonator_status: mysqlData['detonator_status'],
			partial_blast_lfs: mysqlData['partial_blast_lfs'],
			full_blast_lfs: mysqlData['full_blast_lfs'],
			booster_fired_lfs: mysqlData['booster_fired_lfs'],
			missing_pulse_detected_lfs: mysqlData['missing_pulse_detected_lfs'],
			mains: mysqlData['mains']
	}
	return ib651DataObject;
}

function createAb1DataObject(mysqlData){
	var ab1DataObject = {
			communication_status: mysqlData['communication_status'],
			window_id: mysqlData['window_id'],
			key_switch_status: mysqlData['key_switch_status'],
			detonator_status: mysqlData['detonator_status'],
			blast_armed: mysqlData['blast_armed'],
			isolation_relay: mysqlData['isolation_relay'],
			cable_fault: mysqlData['cable_fault'],
			earth_leakage: mysqlData['earth_leakage'],
			partial_blast_lfs: mysqlData['partial_blast_lfs'],
			full_blast_lfs: mysqlData['full_blast_lfs'],
			booster_fired_lfs: mysqlData['booster_fired_lfs'],
			missing_pulse_detected_lfs: mysqlData['missing_pulse_detected_lfs'],
			mains: mysqlData['mains'],
			shaft_fault: mysqlData['shaft_fault'],
			low_bat: mysqlData['low_bat'],
			shaft_fault: mysqlData['shaft_fault'],
			too_low_bat: mysqlData['too_low_bat'],
			DC_supply_voltage_status: mysqlData['DC_supply_voltage_status']
	}
	return ab1DataObject;
}

function createEddDataObject(mysqlData){
	var eddDataObject = {
			communication_status: mysqlData['communication_status'],
			window_id: mysqlData['window_id'],
			program: mysqlData['program'],
			calibration: mysqlData['calibratation'],
			det_fired: mysqlData['det_fired'],
			tagged: mysqlData['tagged'],
			energy_storing: mysqlData['energy_storing'],
			bridge_wire: mysqlData['bridge_wire'],
			delay: mysqlData['delay']
	}
	return eddDataObject;
}