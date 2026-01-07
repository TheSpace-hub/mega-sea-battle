package hub.thespace.megaseabattle;

import hub.thespace.megaseabattle.game.Game;
import hub.thespace.megaseabattle.controllers.game.GameController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Slf4j
public class SenderOfPages {

    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }

    @GetMapping("/game/{id}")
    public String game(@PathVariable String id, Model model, @RequestParam String username) {
        Game game = GameController.getGameById(id);
        if (game == null)
            return "redirect:/";

        model.addAttribute("id", game.getId().toUpperCase());
        model.addAttribute("maxPlayers", game.getMaxPlayers());
        model.addAttribute("username", username);
        return "battlefield";
    }

}
