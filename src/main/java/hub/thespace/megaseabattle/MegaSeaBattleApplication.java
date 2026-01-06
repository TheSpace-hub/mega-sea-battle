package hub.thespace.megaseabattle;

import hub.thespace.megaseabattle.game.GameConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MegaSeaBattleApplication {

    public static void main(String[] args) {
        SpringApplication.run(MegaSeaBattleApplication.class, args);

        GameConfig.games.add(new GameConfig("qwert", "Морской Волк", 3));
        GameConfig.games.add(new GameConfig("trewq", "Серёга Пират", 5));
    }

}
