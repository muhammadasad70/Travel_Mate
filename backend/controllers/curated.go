// controllers/curated.go
package controllers

import "strings"

// Keep this in sync with the app (same keys & places)
var placesByCity = map[string][]string{
	"Abbottabad": {"Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"},
	"Galiyat":    {"Abbottabad City", "Ayubia National Park", "Miranjani Top", "Mushkpuri Top", "Nathia Gali", "Thandiani"},
	"Bagh":       {"Ganga Choti", "Lasdana"},
	"Badin":      {"Zero Point (Indo-Pak Border)"},
	"Chitral": {
		"Chitral Valley", "Garam Chashma (Hot Springs)", "Kalash Valley (Bumburet, Rumbur, Birir)",
		"Shandur Pass (Roof of the World)", "Tirich Mir Peak (Hindu Kush)",
	},
	"Dir":            {"Jahaz Banda Meadows", "Katora Lake", "Kumrat Valley", "Thall (gateway to Kumrat)"},
	"Kumrat":         {"Jahaz Banda Meadows", "Katora Lake", "Kumrat Valley", "Thall (gateway to Kumrat)"},
	"Gilgit":         {"Bagrot Valley", "Bireno Suspension Bridge", "Chinese Cemetery (Danyore Valley)", "Firoza Lake", "Junction of Three Mountain Ranges", "Kargah Valley / Kargah Buddha site", "Kutwal Lake", "Naltar Valley", "SatRangi Lake", "Taj Mughal Minar (Mughali Shikar)"},
	"Haveli":         {"Khai Gala", "Neza Gali"},
	"Hunza Valley":   {"Altit Fort", "Attabad Lake", "Baltit Fort", "Hussaini Suspension Bridge", "Khunjerab Pass", "Passu Cones & Glacier", "Borith Lake"},
	"Islamabad":      {"Centaurus Mall & Blue Area", "Daman-e-Koh", "Faisal Mosque", "Fatima Jinnah Park (F-9 Park)", "Golra Sharif Railway Museum", "Japan Park", "Lake View Park", "Lok Virsa Museum", "Margalla Hills National Park", "Pakistan Monument & Museum", "Pakistan Natural History Museum", "Pir Sohawa & Monal", "Rawal Lake & Viewpoint", "Rawalpindi/Islamabad Metro Bus Route", "Rose & Jasmine Garden", "Saidpur Village", "Shakarparian Hills & Pakistan Monument Park", "Trail 3, Trail 5, Trail 6 (Margalla)"},
	"Karachi":        {"Churna Island", "Clifton Beach", "Empress Market", "French Beach", "Frere Hall", "Hawksbay Beach", "Karachi Safari Park", "Karachi Zoo", "Mohatta Palace", "National Museum of Pakistan", "PAF Museum Karachi", "Pakistan Maritime Museum", "Quaid-e-Azam Mausoleum (Mazar-e-Quaid)", "Sandspit Beach", "Turtle Beach"},
	"Kotli":          {"Kotli Waterfalls", "Teenda"},
	"Lahore":         {"Alhamra Arts Council", "Anarkali Bazaar", "Badshahi Mosque", "Data Darbar", "Emporium Mall", "Food Street (Gawalmandi / Fort Road)", "Fortress Stadium & Market", "Gaddafi Stadium", "Hazuri Bagh", "Iqbal Park", "Lahore Fort (Shahi Qila)", "Lahore Museum", "Lahore Safari Park", "Lahore Zoo", "Minar-e-Pakistan", "Packages Mall", "Race Course Park (Jilani Park)", "Shalimar Gardens", "Sheesh Mahal", "Wazir Khan Mosque"},
	"Multan":         {"Chaman Zar Askari Lake & Park", "Chenab River Bank Picnic Points", "Eidgah Mosque", "Ghanta Ghar (Clock Tower)", "Hussain Agahi Bazaar", "Multan Arts Council", "Multan Cricket Stadium", "Multan Fort (Qasim Bagh Fort)", "Old City Gates", "Shah Gardez Tomb", "Shah Yousaf Gardez Tomb", "Shrine of Bahauddin Zakariya", "Shrine of Shah Rukn-e-Alam", "Shrine of Shah Shams Tabrez", "Tomb of Mai Maharban"},
	"Muzaffarabad":   {"Pir Chinasi", "Shaheed Gali", "Subri Lake"},
	"Nagar Valley":   {"Nagar Valley"},
	"Nagarparkar":    {"Jain Temples Nagarparkar", "Karoonjhar Mountains"},
	"Naran & Kaghan": {"Ansoo Lake", "Babusar Top", "Dudipatsar Lake", "Kaghan", "Lulusar Lake", "Naran", "Saif-ul-Malook Lake"},
	"Neelum Valley":  {"Arang Kel", "Kel", "Keran", "Sharda"},
	"Rawalakot":      {"Banjosa Lake", "Rawalakot Valley", "Toli Pir"},
	"Skardu":         {"Manthokha Waterfall", "Katpana Tso (Katpana Desert & Lake)", "Satpara Tso Lake", "Shangrila Resort / Lower Kachura Lake", "Skardu Valley"},
	"Swat Valley":    {"Bahrain", "Gabral Valley", "Kalam Valley", "Madyan", "Mahodand Lake", "Malam Jabba (ski resort)", "Ushu Forest"},
	"Murree":         {"Mall Road, Murree", "Pindi Point", "Kashmir Point", "Patriata (New Murree)", "Murree Wildlife Park (Bansara Gali)", "Bhurban", "Nathia Gali", "Mushkpuri Top", "Ayubia National Park", "Ghora Gali", "Upper Topa", "Lower Topa", "Dagri Forest", "Kohala Point / Kohala Bridge", "Holy Trinity Church (Mall Road)"},
}

func isValidCity(city string) bool {
	_, ok := placesByCity[city]
	return ok
}

func isCuratedPlace(city, place string) bool {
	pl := strings.TrimSpace(strings.ToLower(place))
	if pl == "" {
		return false
	}
	for _, p := range placesByCity[city] {
		if strings.ToLower(strings.TrimSpace(p)) == pl {
			return true
		}
	}
	return false
}

// validate & classify a place string for the given city.
// returns normalizedPlace, placeSource("curated"|"custom"), isValid(bool)
func classifyPlace(city, place string) (string, string, bool) {
	trim := strings.TrimSpace(place)
	if trim == "" {
		return "", "", false
	}
	if isCuratedPlace(city, trim) {
		return trim, "curated", true
	}
	// custom allowed as long as 2+ chars
	if len([]rune(trim)) >= 2 {
		return trim, "custom", true
	}
	return "", "", false
}

func validHHMM(s string) bool {
	// "" is allowed (optional). If present must be HH:MM 24h
	if strings.TrimSpace(s) == "" {
		return true
	}
	if len(s) != 5 || s[2] != ':' {
		return false
	}
	hh := (s[0]-'0')*10 + (s[1] - '0')
	mm := (s[3]-'0')*10 + (s[4] - '0')
	return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59
}
