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