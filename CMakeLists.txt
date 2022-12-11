cmake_minimum_required(VERSION 3.0.2)
project(eric_a_web)

find_package(catkin REQUIRED)

###################################
## catkin specific configuration ##
###################################
catkin_package()

#############
## Install ##
#############

install(DIRECTORY launch
   DESTINATION ${CATKIN_PACKAGE_SHARE_DESTINATION}
)

install(PROGRAMS
   app_ros.js
   DESTINATION ${CATKIN_PACKAGE_BIN_DESTINATION}
)