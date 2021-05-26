CREATE DEFINER=`root`@`localhost` PROCEDURE `select_rand_tracks_not_artist`(
	dur int,
    g int
)
begin
	
	declare total int default 0;
    DECLARE CONTINUE  HANDLER FOR 1062
    BEGIN
     SELECT "DUPLICATE KEY";
    END;
		while total < dur do
			insert into temp_not_artist 
            select * from tracks
            where genre = g
            order by rand()
            limit 1;
            
            set total = (select sum(duration) a from temp_not_artist);            
    end while;
    select * from temp_not_artist;
end