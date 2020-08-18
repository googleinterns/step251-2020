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

- It should be already enabled on your corporate machine.

2. To see current branch information in your command line, just add \_\_git_ps1
   to your PS1:

- Add this
  `export PS1='[\t] $(getLocalPath)$(getcl)\n[\u@\h$(__git_ps1) ]$ '` to
  the end of your `~/.bashrc`

3. Some good git GUI: [gitk](https://git-scm.com/docs/gitk),
   qgit (`apt install qgit`) or [tortoise git](https://tortoisegit.org/)

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

and open `target/site/jacoco/index.html` with your browser.

[More details and samples here](https://www.baeldung.com/jacoco)

### Deploying Angular Application with Maven and Google App Engine plugin

Running `ng build` in the app directory will create a _dist_ folder, containing the compiled sources. In order to deploy the app the sources, they have to be copied to the _target_ folder, created by Maven. Files can be copied using the _maven-resources-plugin_.

1. Create a _mvn_ folder next to _src_.
2. Add an empty Google App Engine web app:

```
angular-app
│   angular.json
└── src
│   └── app
│
└─── mvn
    │   pom.xml
    └── src/main/webapp/WEB-INF
        └── appengine-web.xml
```

3. Add the folowing to your _pom.xml_:

```xml
<plugins>
  <plugin>
    <artifactId>maven-resources-plugin</artifactId>
    <executions>
      <execution>
        <id>copy-resources</id>
        <phase>validate</phase>
        <goals>
          <goal>copy-resources</goal>
        </goals>
        <configuration>
          <outputDirectory>target/step-release-vis-1/</outputDirectory>
          <resources>
            <resource>
              <directory>../dist/step-release-vis/</directory>
            </resource>
          </resources>
        </configuration>
      </execution>
    </executions>
  </plugin>
...
</plugins>
```

4. From the Angular app folder run:

```
ng build
cd mvn
mvn package appengine:run
```

5. In the terminal verify that the resources were copied sucessfully:

```
[INFO] --- maven-resources-plugin:2.6:copy-resources (copy-resources) @  step-release-vis ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Copying 22 resources
```

# Code formatting tips and tricks

### Set up auto formatter ([source](https://www.jetbrains.com/help/webstorm/prettier.html)).

1. Make sure the _Prettier_ plugin is installedand enabled in WebStorm on the **Settings/Preferences | Plugins** page.
2. In the WebStorm terminal run
   - `npm install --save-dev --save-exact prettier`
3. In the **Settings/Preferences** dialog, go to **Languages and Frameworks | JavaScript | Prettier**. The _node interpreter_ and _prettier package_ should be automatically set.
4. Check both _On code reformatting_ and _On save_ checkboxes.
5. Add a `.prettierrc.json` file next to `package.json` and paste the following:

```json
{
  "bracketSpacing": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "avoid"
}
```

6. Verify the installation by navigating to one of your files, adding a small change and saving the file.
