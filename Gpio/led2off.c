#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (9, OUTPUT) ;
  digitalWrite (9,  HIGH) ; delay (10) ;  
  return 0 ;
}