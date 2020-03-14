﻿using NetTaskInterface;
using NetTaskServer.DB;
using NetTaskServer.HttpServer;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;

namespace NetTaskServer
{
    class Program
    {
        const string DB_PATH = "./user.db";
        const string LOG_PATH = "./logs";
        static void Main(string[] args)
        {

            CancellationTokenSource ctsHttp = new CancellationTokenSource();
            IDbOperator DbOp = new LiteDbOperator(DB_PATH);//加载数据库
            HttpServerAPIs api = new HttpServerAPIs(null, DbOp, LOG_PATH);
            HttpServer.HttpServer httpServer = new HttpServer.HttpServer(NLog.LogManager.GetCurrentClassLogger(), api);
            var t = httpServer.StartHttpService(ctsHttp, 8888);

            Console.ReadKey();
        }

    }
}