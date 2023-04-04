use house;
create table if not exists room_data(url varchar(200),title varchar(100),city varchar(20),district varchar(20),road varchar(20),
community varchar(20),upTime varchar(20),saveTime datetime,price varchar(30),rentalMethod varchar(30),requireType varchar(30),
houseType varchar(30),roomType varchar(30),areaSize varchar(30),decorateType varchar(30),ori varchar(30),liveInfo varchar(30),
rentTimeInfo varchar(30),viewInfo varchar(30),floorInfo varchar(30),elevtorInfo varchar(30),carInfo varchar(30),
waterInfo varchar(30),electrInfo varchar(30),gasInfo varchar(30),heatInfo  varchar(30),hasTelevision tinyint(1),
hasRefrigerator tinyint(1),hasWashingMachine tinyint(1),hasBalcony tinyint(1),hasCook tinyint(1),hasAirConditioner  tinyint(1),
hasWaterHeater tinyint(1),hasBed tinyint(1),hasWordrobe tinyint(1),hasSofa tinyint(1),hasWifi tinyint(1),traffic text, bedroom text,
bathroom text,halls text,description text,pic varchar(5000),primary key(title,saveTime))ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1