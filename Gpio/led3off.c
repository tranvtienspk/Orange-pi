#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (7, OUTPUT) ;
  digitalWrite (7,  HIGH) ; delay (10) ;  
  return 0 ;
}