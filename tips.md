Step251-2020
   
# Git tips and tricks
   
### Simple development flow
  
```
(master) $ git pull
(master) $ git checkout -b <your_branch_name>
(your_branch_name) $ git commit -am "Your change description"
...
(your_branch_name) $ git commit -am "Your last change description"
(your_branch_name) $ git pull
(your_branch_name) $ git merge master
(your_branch_name) $ git push origin <your_branch_name>

Create a pull request on Github, if needed.
```

### Improve your git experience

1. Git has autocompletion: type "git che<TAB>" to get "git checkout", type <TAB>
one more time to get list of branches
  * It should be already enabled on your corporate machine.
2. To see current branch information in your command line, just add __git_ps1 
to your PS1: 
  * Add this 
```export PS1='[\t] $(getLocalPath)$(getcl)\n[\u@\h$(__git_ps1) ]$ ' ``` to 
the end of your ```~/.bashrc```
3. Some good git GUI: [gitk](https://git-scm.com/docs/gitk), 
qgit (```apt install qgit```) or [tortoise git](https://tortoisegit.org/)


### More detailed git guides.

"Git flow" would be an overkill, here are only docs with an essential information:

1. [Introduction from Atlassian](https://www.atlassian.com/git/tutorials/comparing-workflows)
2. [Another simple guide](https://rogerdudler.github.io/git-guide/)

# Maven tips and tricks

### Enabling automated code style checker

Maven has "checkstyle" plugin that... checks style, it has configs for different style
conventions: Sun/Oracle, [Google](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/google_checks.xml), etc.

To enable checkstyle with Google configuration, add plugin into your pom.xml, plugins section: 

```xml
<plugins>
   <!-- ... -->
   <plugin>
       <groupId>org.apache.maven.plugins</groupId>
       <artifactId>maven-checkstyle-plugin</artifactId>
       <version>3.1.1</version>
       <configuration>
           <configLocation>google_checks.xml</configLocation>
           <encoding>UTF-8</encoding>
           <includeTestSourceDirectory>true</includeTestSourceDirectory>
           <consoleOutput>true</consoleOutput>
           <failsOnError>true</failsOnError>
           <linkXRef>false</linkXRef>
       </configuration>
       <executions>
           <execution>
               <id>validate</id>
               <phase>validate</phase>
               <goals>
                   <goal>check</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   <!-- ... -->   
```

### Measuring code coverage

I'd recomend [JaCoCo](https://en.wikipedia.org/wiki/Java_code_coverage_tools#JaCoCo) as a 
coverage tool. It's distributed under [EPL](https://en.wikipedia.org/wiki/Eclipse_Public_License) license,
just like JUnit, so there should be no problem with using it in Google projects.

To get code coverage report after you run the tests, add the plugin to your maven configuration:

```xml

<build>
   <plugins>
      <!-- Other plugins -->
      <plugin>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
        <version>0.8.5</version>
        <configuration>
          <excludes>
            <!-- It makes no sense to measure how well are generated protobuf files are covered  -->
            <exclude>**/path/to/your/protos/*</exclude>
          </excludes>
        </configuration>
      </plugin>
      <!-- Other plugins -->
   </plugins>
</build>
```
run the build command, e.g.:

```bash
mvn clean install verify jacoco:report 
```

and open ``` target/site/jacoco/index.html ``` with your browser.

[More details and samples here](https://www.baeldung.com/jacoco)
