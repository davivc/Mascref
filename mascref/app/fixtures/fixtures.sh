#!/bin/bash   

## declare an array variable
declare -a array=(
	"init_01_auth_users" 
	"init_02_domains" 
	"init_03_accounts"
	"init_04_country"
	"init_05_user_profiles"
	"init_06_data_level"
	"init_07_researchers"
	"maare_01_project"
	"maare_02_surveys"
	"maare_03_towns"
	"maare_04_sites"
	"maare_05_group_set"
	"01_transect_type"
	"02_transect_member_role"
	"03_group_set"
	"04_group_category"
	"05_group"
	"maare_06_groups"
	"maare_08_2015_transects"
	"maare_09_2015_roles"
	"maare_10_2015_line"
	"maare_12_2016_transects"
	"maare_13_2016_roles"
	"usp_01_project"
	"usp_02_surveys"
	"usp_03_towns"
	"usp_04_sites"
	"usp_05_group_set"
	"usp_06_groups"
	"usp_07_2015_transects"
	# "authdata"
	)

# get length of an array
arraylength=${#array[@]}

# use for loop to read all values and indexes
for (( i=1; i<${arraylength}+1; i++ ));
do
	/usr/bin/python /var/www/mascref/mascref/manage.py loaddata ${array[$i-1]}
	echo $i " / " ${arraylength} " : " ${array[$i-1]}
done