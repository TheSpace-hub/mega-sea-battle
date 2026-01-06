package hub.thespace.megaseabattle;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@Slf4j
public class SenderOfPages {

    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }

    @GetMapping("/game/{id}")
    public String game(@PathVariable String id, Model model) {
        model.addAttribute("id", id.toUpperCase());
        model.addAttribute("username", "Юзер");
        return "battlefield";
    }

}
