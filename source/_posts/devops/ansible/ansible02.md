---
title:  ansible Api 开发技巧 2
tags:
  - ansible
categories:
  - 开发笔记 
date: 2022-05-10 19:30:23
---

## 问题描述
在很多时候我们需要，通过ansible api 去实现自动化操作，
而又不能像使用ansible命令那样，尽管这样对于服务器运维的同事讲这是一件容易的事情，
但是很多时候，我们是需要自动定时的去管理大批量的服务器，
需要的不仅仅是能完成这项任务，所以就需要开发一个，可以自动化管理这些服务器及服务器上的应用
并且还能有完备的执行记录以及可回溯的；在实际的自动化api 开发过程中很多的验证过程都需要用到ansible,
其自带的命令来进行验证，有很多的命令的使用方式，在官方提供的文档里并没有比较详细的说明，并且由于ansible 的版本迭代，
导致现有的文档越来越多，尽管看起来很多，但是细细观察，其实都是差不多的，但是这对于刚接触的朋友来讲，
可不是一件容易的事情，他不仅要在众多的版本中寻求到一个符合当前公司环境下适合的版本，还要考虑后续的维护成本；

## 解决方案

1. 选一个比较成熟的版本，首先要了解其常用的命令及使用方式，并搭建一个适当的测试环境

2. 在动手开发自动化的ansible api 时，需要先拉取官方的源代码，重点看 `ansible/lib/ansible/cli` 
    这个目录下的代码，里面包含了，你以前怎么在命令行使用命令去完成你需要实现的任务

3. 当你阅读完以上内容以后，需要对以下`ansible\lib\ansible\module_utils`模块进行深入了解，因为它将是你未来写 ansible api 时最好的参考之一

4. 请通过网页仔细的阅读这部分内容（非常重要） 
![ansible/3629406-cdde75580732a013.jpg](https://cdn.jsdelivr.net/gh/jackerzz/jackerzz.github.io@ersion1.8/images/ansible/3629406-cdde75580732a013.jpg)

5. 当然我们在开发自动化运维，肯定少不了分布式大规模的任务管理，这时候我需要用到celery 来做多节点的ansible 管理
- 注意事项： 
    celery 在对 ansible 进行管理时，会出现ansible 劈里啪啦的把任务执行完了，诶你一看，原来这么容易呀，
    你要这么想，那就掉坑里去了，这里涉及到python 的一个多进程问题导致的，常用的解决方案是：
        1. 在celery 的worker启动窗口设置`export PYTHONOPTIMIZE=1`或打开celery这个参数-O OPTIMIZATION
        2. 注释掉python包multiprocessing下面process.py中102行，关闭assert
    


## 源代码（划重点）

### [`ansible\lib\ansible\cli\__init__.py`](https://github.com/ansible/ansible/blob/40618d70e61af1123907a5fb246cc4fd35f1e5c3/lib/ansible/cli/__init__.py)
```python
    @staticmethod
    def base_parser(usage="", output_opts=False, runas_opts=False, meta_opts=False, runtask_opts=False, vault_opts=False, module_opts=False,
                    async_opts=False, connect_opts=False, subset_opts=False, check_opts=False, inventory_opts=False, epilog=None, fork_opts=False,
                    runas_prompt_opts=False, desc=None, basedir_opts=False, vault_rekey_opts=False):
        ''' create an options parser for most ansible scripts '''

        # base opts
        parser = SortedOptParser(usage, version=CLI.version("%prog"), description=desc, epilog=epilog)
        parser.add_option('-v', '--verbose', dest='verbosity', default=C.DEFAULT_VERBOSITY, action="count",
                          help="verbose mode (-vvv for more, -vvvv to enable connection debugging)")

        if inventory_opts:
            parser.add_option('-i', '--inventory', '--inventory-file', dest='inventory', action="append",
                              help="specify inventory host path or comma separated host list. --inventory-file is deprecated")
            parser.add_option('--list-hosts', dest='listhosts', action='store_true',
                              help='outputs a list of matching hosts; does not execute anything else')
            parser.add_option('-l', '--limit', default=C.DEFAULT_SUBSET, dest='subset',
                              help='further limit selected hosts to an additional pattern')

        if module_opts:
            parser.add_option('-M', '--module-path', dest='module_path', default=None,
                              help="prepend colon-separated path(s) to module library (default=%s)" % C.DEFAULT_MODULE_PATH,
                              action="callback", callback=CLI.unfrack_paths, type='str')
        if runtask_opts:
            parser.add_option('-e', '--extra-vars', dest="extra_vars", action="append",
                              help="set additional variables as key=value or YAML/JSON, if filename prepend with @", default=[])

        if fork_opts:
            parser.add_option('-f', '--forks', dest='forks', default=C.DEFAULT_FORKS, type='int',
                              help="specify number of parallel processes to use (default=%s)" % C.DEFAULT_FORKS)

        if vault_opts:
            parser.add_option('--ask-vault-pass', default=C.DEFAULT_ASK_VAULT_PASS, dest='ask_vault_pass', action='store_true',
                              help='ask for vault password')
            parser.add_option('--vault-password-file', default=[], dest='vault_password_files',
                              help="vault password file", action="callback", callback=CLI.unfrack_paths, type='string')
            parser.add_option('--vault-id', default=[], dest='vault_ids', action='append', type='string',
                              help='the vault identity to use')

        if vault_rekey_opts:
            parser.add_option('--new-vault-password-file', default=None, dest='new_vault_password_file',
                              help="new vault password file for rekey", action="callback", callback=CLI.unfrack_path, type='string')
            parser.add_option('--new-vault-id', default=None, dest='new_vault_id', type='string',
                              help='the new vault identity to use for rekey')

        if subset_opts:
            parser.add_option('-t', '--tags', dest='tags', default=C.TAGS_RUN, action='append',
                              help="only run plays and tasks tagged with these values")
            parser.add_option('--skip-tags', dest='skip_tags', default=C.TAGS_SKIP, action='append',
                              help="only run plays and tasks whose tags do not match these values")

        if output_opts:
            parser.add_option('-o', '--one-line', dest='one_line', action='store_true',
                              help='condense output')
            parser.add_option('-t', '--tree', dest='tree', default=None,
                              help='log output to this directory')

        if connect_opts:
            connect_group = optparse.OptionGroup(parser, "Connection Options", "control as whom and how to connect to hosts")
            connect_group.add_option('-k', '--ask-pass', default=C.DEFAULT_ASK_PASS, dest='ask_pass', action='store_true',
                                     help='ask for connection password')
            connect_group.add_option('--private-key', '--key-file', default=C.DEFAULT_PRIVATE_KEY_FILE, dest='private_key_file',
                                     help='use this file to authenticate the connection', action="callback", callback=CLI.unfrack_path, type='string')
            connect_group.add_option('-u', '--user', default=C.DEFAULT_REMOTE_USER, dest='remote_user',
                                     help='connect as this user (default=%s)' % C.DEFAULT_REMOTE_USER)
            connect_group.add_option('-c', '--connection', dest='connection', default=C.DEFAULT_TRANSPORT,
                                     help="connection type to use (default=%s)" % C.DEFAULT_TRANSPORT)
            connect_group.add_option('-T', '--timeout', default=C.DEFAULT_TIMEOUT, type='int', dest='timeout',
                                     help="override the connection timeout in seconds (default=%s)" % C.DEFAULT_TIMEOUT)
            connect_group.add_option('--ssh-common-args', default='', dest='ssh_common_args',
                                     help="specify common arguments to pass to sftp/scp/ssh (e.g. ProxyCommand)")
            connect_group.add_option('--sftp-extra-args', default='', dest='sftp_extra_args',
                                     help="specify extra arguments to pass to sftp only (e.g. -f, -l)")
            connect_group.add_option('--scp-extra-args', default='', dest='scp_extra_args',
                                     help="specify extra arguments to pass to scp only (e.g. -l)")
            connect_group.add_option('--ssh-extra-args', default='', dest='ssh_extra_args',
                                     help="specify extra arguments to pass to ssh only (e.g. -R)")

            parser.add_option_group(connect_group)

        runas_group = None
        rg = optparse.OptionGroup(parser, "Privilege Escalation Options", "control how and which user you become as on target hosts")
        if runas_opts:
            runas_group = rg
            # priv user defaults to root later on to enable detecting when this option was given here
            runas_group.add_option("-s", "--sudo", default=C.DEFAULT_SUDO, action="store_true", dest='sudo',
                                   help="run operations with sudo (nopasswd) (deprecated, use become)")
            runas_group.add_option('-U', '--sudo-user', dest='sudo_user', default=None,
                                   help='desired sudo user (default=root) (deprecated, use become)')
            runas_group.add_option('-S', '--su', default=C.DEFAULT_SU, action='store_true',
                                   help='run operations with su (deprecated, use become)')
            runas_group.add_option('-R', '--su-user', default=None,
                                   help='run operations with su as this user (default=%s) (deprecated, use become)' % C.DEFAULT_SU_USER)

            # consolidated privilege escalation (become)
            runas_group.add_option("-b", "--become", default=C.DEFAULT_BECOME, action="store_true", dest='become',
                                   help="run operations with become (does not imply password prompting)")
            runas_group.add_option('--become-method', dest='become_method', default=C.DEFAULT_BECOME_METHOD, type='choice', choices=C.BECOME_METHODS,
                                   help="privilege escalation method to use (default=%s), valid choices: [ %s ]" %
                                   (C.DEFAULT_BECOME_METHOD, ' | '.join(C.BECOME_METHODS)))
            runas_group.add_option('--become-user', default=None, dest='become_user', type='string',
                                   help='run operations as this user (default=%s)' % C.DEFAULT_BECOME_USER)

        if runas_opts or runas_prompt_opts:
            if not runas_group:
                runas_group = rg
            runas_group.add_option('--ask-sudo-pass', default=C.DEFAULT_ASK_SUDO_PASS, dest='ask_sudo_pass', action='store_true',
                                   help='ask for sudo password (deprecated, use become)')
            runas_group.add_option('--ask-su-pass', default=C.DEFAULT_ASK_SU_PASS, dest='ask_su_pass', action='store_true',
                                   help='ask for su password (deprecated, use become)')
            runas_group.add_option('-K', '--ask-become-pass', default=False, dest='become_ask_pass', action='store_true',
                                   help='ask for privilege escalation password')

        if runas_group:
            parser.add_option_group(runas_group)

        if async_opts:
            parser.add_option('-P', '--poll', default=C.DEFAULT_POLL_INTERVAL, type='int', dest='poll_interval',
                              help="set the poll interval if using -B (default=%s)" % C.DEFAULT_POLL_INTERVAL)
            parser.add_option('-B', '--background', dest='seconds', type='int', default=0,
                              help='run asynchronously, failing after X seconds (default=N/A)')

        if check_opts:
            parser.add_option("-C", "--check", default=False, dest='check', action='store_true',
                              help="don't make any changes; instead, try to predict some of the changes that may occur")
            parser.add_option('--syntax-check', dest='syntax', action='store_true',
                              help="perform a syntax check on the playbook, but do not execute it")
            parser.add_option("-D", "--diff", default=C.DIFF_ALWAYS, dest='diff', action='store_true',
                              help="when changing (small) files and templates, show the differences in those files; works great with --check")

        if meta_opts:
            parser.add_option('--force-handlers', default=C.DEFAULT_FORCE_HANDLERS, dest='force_handlers', action='store_true',
                              help="run handlers even if a task fails")
            parser.add_option('--flush-cache', dest='flush_cache', action='store_true',
                              help="clear the fact cache for every host in inventory")

        if basedir_opts:
            parser.add_option('--playbook-dir', default=None, dest='basedir', action='store',
                              help="Since this tool does not use playbooks, use this as a subsitute playbook directory."
                                   "This sets the relative path for many features including roles/ group_vars/ etc.")
        return parser

    @abstractmethod
    def parse(self):
        """Parse the command line args

        This method parses the command line arguments.  It uses the parser
        stored in the self.parser attribute and saves the args and options in
        self.args and self.options respectively.

        Subclasses need to implement this method.  They will usually create
        a base_parser, add their own options to the base_parser, and then call
        this method to do the actual parsing.  An implementation will look
        something like this::

            def parse(self):
                parser = super(MyCLI, self).base_parser(usage="My Ansible CLI", inventory_opts=True)
                parser.add_option('--my-option', dest='my_option', action='store')
                self.parser = parser
                super(MyCLI, self).parse()
                # If some additional transformations are needed for the
                # arguments and options, do it here.
        """
        # 此次就是我们通过命令行传入的参数入口，可以通过print 的方式，将其打印出来（需要修改这部分源代码）
        self.options, self.args = self.parser.parse_args(self.args[1:])
        print("self.options",self.options)
        print("self.args",self.args)
        # 此处的作用仅用来验证，不会与你所开发ansible api 重合
        # process tags
        if hasattr(self.options, 'tags') and not self.options.tags:
            # optparse defaults does not do what's expected
            self.options.tags = ['all']
        if hasattr(self.options, 'tags') and self.options.tags:
            tags = set()
            for tag_set in self.options.tags:
                for tag in tag_set.split(u','):
                    tags.add(tag.strip())
            self.options.tags = list(tags)

        # process skip_tags
        if hasattr(self.options, 'skip_tags') and self.options.skip_tags:
            skip_tags = set()
            for tag_set in self.options.skip_tags:
                for tag in tag_set.split(u','):
                    skip_tags.add(tag.strip())
            self.options.skip_tags = list(skip_tags)

        # process inventory options except for CLIs that require their own processing
        if hasattr(self.options, 'inventory') and not self.SKIP_INVENTORY_DEFAULTS:

            if self.options.inventory:

                # should always be list
                if isinstance(self.options.inventory, string_types):
                    self.options.inventory = [self.options.inventory]

                # Ensure full paths when needed
                self.options.inventory = [unfrackpath(opt, follow=False) if ',' not in opt else opt for opt in self.options.inventory]
            else:
                self.options.inventory = C.DEFAULT_HOST_LIST
```