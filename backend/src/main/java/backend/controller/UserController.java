package backend.controller;

import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            return "Email already exists";
        }

        userRepository.save(user);
        return "Registration Successful";
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {

            System.out.println("DB Password = " + existingUser.getPassword());
            System.out.println("Entered Password = " + user.getPassword());

            if (existingUser.getPassword().equals(user.getPassword())) {
                return "Login Successful";
            }
        }

        return "Invalid Email or Password";
    }
}